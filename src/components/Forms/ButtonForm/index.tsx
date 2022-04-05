import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { Container, Title } from './styles';

interface Props extends RectButtonProps {
  title: string;
  onPress: () => void;
}

const ButtonForm: React.FC<Props> = ({ title, onPress, ...rest }) => (
  <Container onPress={onPress} {...rest}>
    <Title>{title}</Title>
  </Container>
);

export default ButtonForm;
