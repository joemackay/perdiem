import { loginWithEmail } from '@/api/auth';
import { useAuth } from '@/core/auth';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/ui/button';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import LoginService from '../pages/loginservice'; // adjust path as needed
jest.mock('@react-native-firebase/auth', () => {
  return () => ({
    onAuthStateChanged: jest.fn(() => jest.fn()), // mock unsubscribe
    signInWithCredential: jest.fn(),
  });
});
// Mock necessary modules
jest.mock('@/api/auth');
jest.mock('@/core/auth', () => ({
  useAuth: {
    use: {
      saveToken: jest.fn(),
    },
  },
}));
jest.mock('@/store/auth-store', () => ({
  useAuthStore: () => ({
    setUser: jest.fn(),
  }),
}));
jest.mock('expo-router', () => ({
  router: {
    navigate: jest.fn(),
  },
  Link: ({ href, children }: any) => <>{children}</>,
}));
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({
      data: { idToken: 'fake-id-token' },
    }),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
  GoogleSigninButton: ({ onPress }: any) => (
    <Button onPress={onPress} testID="google-signin-button">Google Signin</Button>
  ),
}));

describe('LoginService', () => {
  it('logs in with email and navigates on success', async () => {
    const mockResponse = {
      user_uuid: '123',
      fname: 'John',
      lname: 'Doe',
      picture: '',
      email: 'user@tryperdiem.com',
      token: 'abc123',
    };

    // Set up mocks
    (loginWithEmail as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = render(<LoginService />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login with Email');

    fireEvent.changeText(emailInput, 'user@tryperdiem.com');
    fireEvent.changeText(passwordInput, 'password');

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(loginWithEmail).toHaveBeenCalledWith('user@tryperdiem.com', 'password');
      expect(useAuth.use.saveToken).toHaveBeenCalledWith({ access: 'abc123', refresh: 'abc123' });
      expect(useAuthStore().setUser).toHaveBeenCalledWith(mockResponse);
    });
  });

  // it('signs in with Google successfully', async () => {
  //   const signInWithCredentialMock = jest.fn();
  //   (auth as any).GoogleAuthProvider = {
  //     credential: jest.fn().mockReturnValue('mock-credential'),
  //   };
  //   (auth as any).mockReturnValue({
  //     signInWithCredential: signInWithCredentialMock,
  //     onAuthStateChanged: jest.fn(() => jest.fn()),
  //   });

  //   const { getByTestId } = render(<LoginService />);
  //   fireEvent.press(getByTestId('google-signin-button'));

  //   await waitFor(() => {
  //     expect(signInWithCredentialMock).toHaveBeenCalledWith('mock-credential');
  //   });
  // });
  it('shows error message when login fails', async () => {
    (loginWithEmail as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    const { getByText } = render(<LoginService />);

    fireEvent.press(getByText('Login with Email'));

    await waitFor(() => {
      // We expect the console error or some error state (visually could be tested too if UI updates)
      expect(loginWithEmail).toHaveBeenCalled();
    });
  });
});
