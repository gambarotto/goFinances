import React, { useCallback } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Alert } from 'react-native';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWapper,
} from './styles';

import LogoSvg from '../../assets/logo.svg';
import GoogleSvg from '../../assets/google.svg';
import AppleSvg from '../../assets/apple.svg';
import SignInSocialButton from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';

const SignIn: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log(error);

      Alert.alert('Erro ao tentar fazer login');
    }
  }, [signInWithGoogle]);
  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
          <Title>
            Controle suas {'\n'} finanças de forma {'\n'} muito simples
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça seu login com {'\n'} uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWapper>
          <SignInSocialButton
            onPress={handleSignInWithGoogle}
            title="Entrar com Google"
            svg={GoogleSvg}
          />
          <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} />
        </FooterWapper>
      </Footer>
    </Container>
  );
};

export default SignIn;
