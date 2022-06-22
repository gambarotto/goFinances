import { renderHook, act } from '@testing-library/react-hooks';
import fetchMock from 'jest-fetch-mock';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { AuthProvider, useAuth } from './auth';

fetchMock.enableMocks();
jest.mock('expo-auth-session', () => ({
  startAsync: () => ({
    type: 'success',
    params: { access_token: 'token' },
  }),
}));
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

describe('Auth Hook', () => {
  it('should be able to sign in with Google account existing', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: 'any_id',
        email: 'any@gmail.com',
        name: 'Diego',
        photo: 'any_photo.png',
      }),
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      result.current.signInWithGoogle();
    });

    console.log('USER PROFILE =>', result.current.user);

    expect(result.current.user.email).toBe('any@gmail.com');
  });
});
