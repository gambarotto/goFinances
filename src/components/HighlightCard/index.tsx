import React from 'react';

import {
  Amount,
  Container,
  Footer,
  Header,
  Icon,
  LastTransiction,
  Title,
} from './styles';

interface Props {
  title: string;
  amount: string;
  lastTransiction: string;
  type: 'up' | 'down' | 'total';
}

const icon = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
  total: 'dollar-sign',
};

const HighlightCard: React.FC<Props> = ({
  title,
  amount,
  lastTransiction,
  type,
}) => (
  <Container type={type}>
    <Header>
      <Title type={type}>{title}</Title>
      <Icon name={icon[type]} type={type} />
    </Header>
    <Footer>
      <Amount type={type}>{amount}</Amount>
      <LastTransiction type={type}>{lastTransiction}</LastTransiction>
    </Footer>
  </Container>
);

export default HighlightCard;
