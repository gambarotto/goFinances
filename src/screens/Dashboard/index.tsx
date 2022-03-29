import React from 'react';
import HighlightCard from '../../components/HighlightCard';

import {
  Container,
  Header,
  Icon,
  Photo,
  User,
  UserGreeting,
  UserInfo,
  UserName,
  UserWrapper,
} from './styles';

const Dashboard: React.FC = () => (
  <Container>
    <Header>
      <UserWrapper>
        <UserInfo>
          <Photo source={{ uri: 'https://github.com/gambarotto.png' }} />
          <User>
            <UserGreeting>Olá,</UserGreeting>
            <UserName>Diego</UserName>
          </User>
        </UserInfo>
        <Icon name="power" />
      </UserWrapper>
    </Header>
    <HighlightCard />
  </Container>
);

export default Dashboard;
