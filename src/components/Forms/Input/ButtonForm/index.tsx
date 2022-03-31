import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Container, Title } from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
}

const ButtonForm: React.FC<Props> = ({ title, ...rest }) => (
  <Container {...rest}>
    <Title>{title}</Title>
  </Container>
);

export default ButtonForm;
