import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

interface TypeProps {
  type: 'up' | 'down';
}
interface ContainerProps {
  isActive: boolean;
  type: 'up' | 'down';
}
export const Container = styled.View<ContainerProps>`
  width: 48%;

  border: 1.5px solid ${({ theme }) => theme.colors.text};
  border-radius: 5px;

  ${({ type, isActive }) =>
    isActive &&
    type === 'up' &&
    css`
      background-color: ${({ theme }) => theme.colors.success_light};
      border-width: 0;
    `};
  ${({ type, isActive }) =>
    isActive &&
    type === 'down' &&
    css`
      background-color: ${({ theme }) => theme.colors.attention_light};
      border-width: 0;
    `};
`;
export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;
export const Icon = styled(Feather)<TypeProps>`
  color: ${({ theme, type }) =>
    type === 'up' ? theme.colors.success : theme.colors.attention};
  font-size: ${RFValue(24)}px;

  margin-right: 12px;
`;
export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
`;
