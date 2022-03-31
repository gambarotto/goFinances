import React from 'react';
import { TextInputProps } from 'react-native';
import { Container } from './styles';

type Props = TextInputProps;

const Input: React.FC<Props> = ({ ...rest }) => <Container {...rest} />;

export default Input;
