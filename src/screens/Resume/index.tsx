/* eslint-disable import/no-duplicates */
import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useFocusEffect } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';
import HeaderScreen from '../../components/HeaderScreen';
import HistoryCard from '../../components/HistoryCard';
import { TransactionPropsData } from '../../components/TransactionCard';

import {
  Container,
  LoadContainer,
  LoadingIndicator,
  Content,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
  ChartContainer,
} from './styles';
import { categories } from '../../utils/categories';
import { useAuth } from '../../hooks/auth';

interface CategoryData {
  key: string;
  name: string;
  color: string;
  total: number;
  totalFormatted: string;
  percent: string;
}

const Resume: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    [],
  );
  const bottomTabHeight = useBottomTabBarHeight();

  const handleDateSelect = useCallback(
    (action: 'prev' | 'next') => {
      setIsLoading(true);
      if (action === 'next') {
        const newDate = addMonths(selectedDate, 1);
        setSelectedDate(newDate);
      } else {
        const newDate = subMonths(selectedDate, 1);
        setSelectedDate(newDate);
      }
    },
    [selectedDate],
  );
  const loadData = useCallback(async (): Promise<void> => {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      (transaction: TransactionPropsData) =>
        transaction.type === 'negative' &&
        new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
        new Date(transaction.date).getFullYear() === selectedDate.getFullYear(),
    );
    const expensivesTotal = expensives.reduce(
      (acc: number, expensive: TransactionPropsData) =>
        acc + Number(expensive.amount),
      0,
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;
      expensives.forEach((expensive: TransactionPropsData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });
      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        const percent = `${((categorySum / expensivesTotal) * 100).toFixed(
          0,
        )}%`;
        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
        });
      }
    });
    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }, [selectedDate, user.id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  return (
    <Container>
      <HeaderScreen title="Resumo por categoria" />
      {isLoading ? (
        <LoadContainer>
          <LoadingIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: Platform.OS === 'ios' ? bottomTabHeight : 0,
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateSelect('prev')}>
              <SelectIcon name="chevron-left" />
            </MonthSelectButton>
            <Month>
              {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
            </Month>
            <MonthSelectButton onPress={() => handleDateSelect('next')}>
              <SelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>
          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              colorScale={totalByCategories.map((category) => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={50}
              x="percent"
              y="total"
            />
          </ChartContainer>
          {totalByCategories.map((category) => (
            <HistoryCard
              key={category.key}
              title={category.name}
              amount={category.totalFormatted}
              color={category.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
};

export default Resume;
