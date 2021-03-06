/* eslint-disable prefer-spread */
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from 'styled-components';
import HighlightCard from '../../components/HighlightCard';
import TransactionCard, {
  TransactionPropsData,
} from '../../components/TransactionCard';

import {
  Container,
  Header,
  LogoutButton,
  Icon,
  Photo,
  User,
  UserGreeting,
  UserInfo,
  UserName,
  UserWrapper,
  HighlightCards,
  Transactions,
  TitleTransactions,
  TransactionList,
  LoadContainer,
  LoadingIndicator,
} from './styles';
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionPropsData {
  id: string;
}
interface HighlightProps {
  amount: string;
  lastTransiction: string;
}
interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData,
  );
  const theme = useTheme();

  const getLastTransaction = (
    collection: DataListProps[],
    type: 'positive' | 'negative',
  ): string | number => {
    const collectionFilttered = collection.filter(
      (transaction) => transaction.type === type,
    );
    if (collectionFilttered.length === 0) {
      return 0;
    }
    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFilttered.map((transaction) =>
          new Date(transaction.date).getTime(),
        ),
      ),
    );
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      'pt-BR',
      { month: 'long' },
    )}`;
  };
  const loadTransaction = useCallback(async (): Promise<void> => {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const dataAsync = await AsyncStorage.getItem(dataKey);

    const newData = dataAsync ? JSON.parse(dataAsync!) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = newData.map(
      (item: DataListProps) => {
        if (item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));
        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      },
    );
    setTransactions(transactionsFormatted);
    const total = entriesTotal - expensiveTotal;

    const lastTransactionEntries = getLastTransaction(newData, 'positive');
    const lastTransactionExpensives = getLastTransaction(newData, 'negative');
    const totalInterval =
      lastTransactionEntries === 0 && lastTransactionExpensives === 0
        ? 'Sem transa????es'
        : `01 ?? ${
            lastTransactionEntries >= lastTransactionExpensives
              ? lastTransactionEntries
              : lastTransactionExpensives
          }`;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransiction:
          lastTransactionEntries === 0
            ? 'N??o h?? transa????es'
            : `??ltima entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransiction:
          lastTransactionExpensives === 0
            ? 'N??o h?? transa????es'
            : `??ltima saida dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransiction: totalInterval,
      },
    });
    setIsLoading(false);
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      loadTransaction();
    }, [loadTransaction]),
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <LoadingIndicator color={theme.colors.primary} />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: 'https://github.com/gambarotto.png' }} />
                <User>
                  <UserGreeting>Ol??,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransiction={highlightData.entries.lastTransiction}
            />
            <HighlightCard
              type="down"
              title="Sa??das"
              amount={highlightData.expensives.amount}
              lastTransiction={highlightData.expensives.lastTransiction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransiction={highlightData.total.lastTransiction}
            />
          </HighlightCards>
          <Transactions>
            <TitleTransactions>Listagem</TitleTransactions>
            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
