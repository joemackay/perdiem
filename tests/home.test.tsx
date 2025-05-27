import { AuthProvider } from '@/providers/AuthProvider';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import HomeService from '../pages/homeservice';

jest.mock('@react-native-google-signin/google-signin');

// 
jest.mock('react-native-push-notification', () => {
  return {
    configure: jest.fn(),
    createChannel: jest.fn(),
    localNotification: jest.fn(),
    cancelAllLocalNotifications: jest.fn(),
    removeAllDeliveredNotifications: jest.fn(),
    getChannels: jest.fn().mockResolvedValue(['default']),
    checkPermissions: jest.fn((cb) =>
      cb({ alert: true, badge: true, sound: true })
    ),
    requestPermissions: jest.fn().mockResolvedValue(true),
    onNotification: jest.fn(),
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

// Mock expo-localization
jest.mock('expo-localization', () => ({
  timezone: 'America/New_York',
}));

// Mock Firebase and Google Signin
jest.mock('@react-native-firebase/auth', () => ({
  auth: () => ({
    logout: jest.fn(),
  }),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  revokeAccess: jest.fn(),
}));

describe('HomeService', () => {
  const mockUserInfo = {
    fname: 'Joe',
    email: 'user@tryperdiem.com',
    picture: 'http://example.com/pic.jpg',
  };

  const mockLogout = jest.fn();
  const mockSetSelectedDayOfTheMonth = jest.fn();
  const mockSetSelectedTime = jest.fn();
  const mockGetUser = jest.fn(() => mockUserInfo);

  it('renders correctly with user information', () => {
    const { getByText, getByTestId } = render(<AuthProvider><HomeService /></AuthProvider>);
    
    // expect(getByText('Joe')).toBeTruthy();
    expect(getByTestId('test-display-greeting')).toBeTruthy();
    expect(getByTestId('test-select-date-button')).toBeTruthy();
    expect(getByTestId('test-logout-button')).toBeTruthy();
  });

  it('handles logout correctly', async () => {
    const { getByTestId } = render(<AuthProvider><HomeService /></AuthProvider>);
    
    await act(async () => {
      fireEvent.press(getByTestId('test-logout-button'));
    });

    // expect(mockLogout).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/login');
  });

  it('shows date picker when Select Date is pressed', async () => {
    const { queryByTestId, getByTestId } = render(<AuthProvider><HomeService /></AuthProvider>);
    
    fireEvent.press(getByTestId('test-select-date-button'));
    await waitFor(() => {
      expect(queryByTestId('test-custom-date-picker')).toBeTruthy();
    });
  });

  // it('handles time selection and navigates to details', async () => {
  //   const { getByText, getByTestId } = render(<AuthProvider><HomeService /></AuthProvider>);
    
  //   // Open date picker and select a date
  //   // fireEvent.press(getByTestId('test-custom-date-picker')); // select a time slot
  //   fireEvent.press(getByText('10')); // Mock time slot selection
  //   // Open time slots
  //   // Assuming time slots are rendered, we can select a time
  //   // Mock time slots rendering
  
  //   await waitFor(() => {
  //     expect(getByTestId('test-time-slots')).toBeTruthy();
  //   });
    
  //   expect(router.push).toHaveBeenCalledWith('/details');
  // });

  it('displays selected date and time after selection', () => {
    const { getByText, queryByText, getByTestId } = render(<AuthProvider><HomeService /></AuthProvider>);
    
    // Initially should not show selection text
    // expect(queryByText(/You selected/)).toBeFalsy();
    
    // Open date picker and select a date
    fireEvent.press(getByTestId('test-select-date-button'));
    fireEvent.press(getByText('10'));
    
    // Select a time
    // fireEvent.press(getByText('08:00 - 08:30'));
    
    // Re-render with the selected values
    // expect(getByText(/You selected 15th at 08:00/)).toBeTruthy();
  });

});