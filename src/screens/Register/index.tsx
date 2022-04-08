import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import CategorySelectButton from '../../components/Forms/CategorySelectButton';
import ButtonForm from '../../components/Forms/ButtonForm';
import InputForm from '../../components/Forms/InputForm';
import TransactionTypeButton from '../../components/Forms/TransactionTypeButton';
import CategorySelect from '../CategorySelect';
import { Container, Form, Fields, TransactionsTypes } from './styles';
import HeaderScreen from '../../components/HeaderScreen';
import { useAuth } from '../../hooks/auth';

interface FormProps {
  [name: string]: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  amount: Yup.number()
    .typeError('Digite um tipo válido')
    .positive('O valor deve ser positivo')
    .required('O valor é obrigatório'),
});

const Register: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { user } = useAuth();
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleTransactionsTypeSelect = useCallback(
    (type: 'positive' | 'negative') => {
      setTransactionType(type);
    },
    [],
  );
  const handleCloseSelectCategoryModal = useCallback(() => {
    setCategoryModalOpen(false);
  }, []);
  const handleOpenSelectCategoryModal = useCallback(() => {
    setCategoryModalOpen(true);
  }, []);

  const handleRegister = useCallback(
    async (form: FormProps) => {
      if (!transactionType) {
        Alert.alert('Selecone o tipo da transação');
        return;
      }

      if (category.key === 'category') {
        Alert.alert('Selecone uma categoria');
        return;
      }

      const data = {
        id: String(uuid.v4()),
        name: form.name,
        amount: form.amount,
        type: transactionType,
        category: category.key,
        date: new Date(),
      };

      try {
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const dataAsync = await AsyncStorage.getItem(dataKey);
        const currentData = dataAsync ? JSON.parse(dataAsync) : [];
        currentData.push(data);

        await AsyncStorage.setItem(dataKey, JSON.stringify(currentData));

        reset();
        setTransactionType('');
        setCategory({
          key: 'category',
          name: 'Categoria',
        });
        navigation.navigate('Listagem');
      } catch (error) {
        console.log(error);
        Alert.alert('Não foi possível salvar');
      }
    },
    [category.key, navigation, reset, transactionType, user.id],
  );
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <HeaderScreen title="Cadastro" />
        <Form>
          <Fields>
            <InputForm
              control={control}
              name="name"
              error={errors.name && errors.name.message}
              placeholder="nome"
              autoCapitalize="sentences"
              autoCorrect={false}
            />
            <InputForm
              control={control}
              name="amount"
              error={errors.amount && errors.amount.message}
              placeholder="valor"
              keyboardType="numeric"
            />
            <TransactionsTypes>
              <TransactionTypeButton
                title="income"
                type="up"
                onPress={() => handleTransactionsTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton
                title="outcome"
                type="down"
                onPress={() => handleTransactionsTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionsTypes>
            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <ButtonForm title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>
        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default Register;
