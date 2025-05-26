import { act, fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import HomeService from '../pages/homeservice';

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
    fname: 'John',
    email: 'john@example.com',
    picture: 'http://example.com/pic.jpg',
  };

  const mockLogout = jest.fn();
  const mockSetSelectedDayOfTheMonth = jest.fn();
  const mockSetSelectedTime = jest.fn();
  const mockGetUser = jest.fn(() => mockUserInfo);

  it('renders correctly with user information', () => {
    const { getByText, getByTestId } = render(<HomeService />);
    
    expect(getByText('John')).toBeTruthy();
    expect(getByText(/Good (morning|afternoon|evening), New York!/)).toBeTruthy();
    expect(getByTestId('test-select-date-button')).toBeTruthy();
    expect(getByTestId('test-logout-button')).toBeTruthy();
  });

  it('handles logout correctly', async () => {
    const { getByTestId } = render(<HomeService />);
    
    await act(async () => {
      fireEvent.press(getByTestId('test-logout-button'));
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/login');
  });

  it('shows date picker when Select Date is pressed', () => {
    const { queryByTestId, getByTestId } = render(<HomeService />);
    
    fireEvent.press(getByTestId('test-select-date-button'));
    
    expect(queryByTestId('test-custom-date-picker')).toBeTruthy();
  });

  it('handles date selection and shows time slots', () => {
    const { getByText, queryByTestId, getByTestId } = render(<HomeService />);
    
    // Open date picker
    fireEvent.press(getByTestId('test-select-date-button'));
    
    // Select a date assuming date picker renders date "20")
    fireEvent.press(getByText('20'));
    
    expect(mockSetSelectedDayOfTheMonth).toHaveBeenCalledWith(15);
    expect(queryByTestId('test-custom-date-picker')).toBeFalsy();
    
    expect(queryByTestId('test-time-slots')).toBeTruthy();
  });

  it('handles time selection and navigates to details', () => {
    const { getByText, getByTestId } = render(<HomeService />);
    
    // Open date picker and select a date
    fireEvent.press(getByTestId('test-select-date-button'));
    fireEvent.press(getByText('20'));
    
    // Select a time (assuming time slots renders times like "08:00 AM")
    fireEvent.press(getByText('08:00 AM'));
    
    expect(mockSetSelectedTime).toHaveBeenCalledWith('08:00 AM');
    expect(router.push).toHaveBeenCalledWith('/details');
  });

  it('displays selected date and time after selection', () => {
    const { getByText, queryByText, getByTestId } = render(<HomeService />);
    
    // Initially should not show selection text
    expect(queryByText(/You selected/)).toBeFalsy();
    
    // Open date picker and select a date
    fireEvent.press(getByTestId('test-select-date-button'));
    fireEvent.press(getByText('20'));
    
    // Select a time
    fireEvent.press(getByText('08:00 AM'));
    
    // Re-render with the selected values
    expect(getByText(/You selected 15th at 08:00 AM/)).toBeTruthy();
  });

  // it('updates greeting based on current time', () => {
  //   // Mock different hours to test greeting logic
  //   const mockDate = new Date(2023, 10, 15, 14, 0, 0); // 2:00 PM
  //   jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
  //   const { getByText } = render(<HomeService />);
    
  //   expect(getByText('Good afternoon, New York!')).toBeTruthy();
    
  //   // Restore original Date
  //   jest.restoreAllMocks();
  // });
});