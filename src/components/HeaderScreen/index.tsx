import React from 'react';
import { Container, Title } from './styles';

interface Props {
  title: string;
}
const HeaderScreen: React.FC<Props> = ({ title }) => (
  <Container>
    <Title>{title}</Title>
  </Container>
);

export default HeaderScreen;
