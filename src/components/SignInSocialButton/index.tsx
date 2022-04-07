import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';
import { Container, ImageContainer, Title } from './styles';

interface Props extends RectButtonProps {
  title: string;
  svg: React.FC<SvgProps>;
}
const SignInSocialButton: React.FC<Props> = ({ title, svg: Svg, ...rest }) => (
  <Container {...rest}>
    <ImageContainer>
      <Svg />
    </ImageContainer>
    <Title>{title}</Title>
  </Container>
);

export default SignInSocialButton;
