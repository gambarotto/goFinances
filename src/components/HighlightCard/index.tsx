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

const HighlightCard: React.FC = () => (
  <Container>
    <Header>
      <Title>Entrada</Title>
      <Icon name="arrow-up-circle" />
    </Header>
    <Footer>
      <Amount>R$ 17.400,00</Amount>
      <LastTransiction>Última entrada dia 13 de abril</LastTransiction>
    </Footer>
  </Container>
);

export default HighlightCard;
