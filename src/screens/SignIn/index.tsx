import React, { useCallback, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Alert, Platform } from 'react-native';
import { useTheme } from 'styled-components';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWapper,
  LoadingIndicator,
} from './styles';

import LogoSvg from '../../assets/logo.svg';
import GoogleSvg from '../../assets/google.svg';
import AppleSvg from '../../assets/apple.svg';
import SignInSocialButton from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';

const SignIn: React.FC = () => {
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar com a conta Google');
      setIsLoading(false);
    }
  }, [signInWithGoogle]);

  const handleSignInWithApple = useCallback(async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch (error) {
      console.log(error);

      Alert.alert('Não foi possível conectar com a conta Apple');
      setIsLoading(false);
    }
  }, [signInWithApple]);

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
            enabled={!isLoading}
            onPress={handleSignInWithGoogle}
            title="Entrar com Google"
            svg={GoogleSvg}
          />
          {Platform.OS === 'ios' && (
            <SignInSocialButton
              enabled={!isLoading}
              onPress={handleSignInWithApple}
              title="Entrar com Apple"
              svg={AppleSvg}
            />
          )}
        </FooterWapper>
        {isLoading && (
          <LoadingIndicator color={theme.colors.shape} size="small" />
        )}
      </Footer>
    </Container>
  );
};

export default SignIn;
