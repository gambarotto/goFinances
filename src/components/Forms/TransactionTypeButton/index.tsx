import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { Container, Button, Icon, Title } from './styles';

interface Props extends RectButtonProps {
  title: string;
  type: 'up' | 'down';
  isActive: boolean;
}
const icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
};

const TransactionTypeButton: React.FC<Props> = ({
  title,
  type,
  isActive,
  ...rest
}) => (
  <Container isActive={isActive} type={type}>
    <Button {...rest}>
      <Icon name={icons[type]} type={type} />
      <Title>{title}</Title>
    </Button>
  </Container>
);

export default TransactionTypeButton;
