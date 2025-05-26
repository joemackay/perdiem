import TimezoneToggle from '@/ui/TimeZoneToggle';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

// Mock the Zustand store

describe('TimezoneToggle', () => {
  const mockSetSelectedTimezone = jest.fn();
  const mockLocale = 'Africa/Nairobi';

  it('renders correctly with initial props', () => {
    const { getByTestId, getByText } = render(
      <TimezoneToggle locale={mockLocale} />
    );

    // Check container and elements are rendered
    expect(getByTestId('test-tz-container')).toBeTruthy();
    expect(getByTestId('test-tz-locale')).toBeTruthy();
    expect(getByTestId('test-tz-switch')).toBeTruthy();
    
    // Check text content
    expect(getByText(mockLocale)).toBeTruthy();
    expect(getByText('NYC Timezone')).toBeTruthy();
  });

  it('calls setSelectedTimezone with correct values when toggled', () => {
    const { getByTestId } = render(
      <TimezoneToggle locale={mockLocale} />
    );

    const switchElement = getByTestId('test-tz-switch');
    
    // First toggle (from NYC to locale)
    fireEvent(switchElement, 'valueChange', false);
    expect(mockSetSelectedTimezone).toHaveBeenCalledWith(mockLocale);
    
    // Second toggle (back to NYC)
    fireEvent(switchElement, 'valueChange', true);
    expect(mockSetSelectedTimezone).toHaveBeenCalledWith('America/New_York');
  });

  it('updates internal state when toggled', () => {
    const { getByTestId } = render(
      <TimezoneToggle locale={mockLocale} />
    );

    const switchElement = getByTestId('test-tz-switch');
    
    // Initial state (true for NYC timezone)
    expect(switchElement.props.value).toBe(true);
    
    // Toggle off
    fireEvent(switchElement, 'valueChange', false);
    expect(switchElement.props.value).toBe(false);
    
    // Toggle on
    fireEvent(switchElement, 'valueChange', true);
    expect(switchElement.props.value).toBe(true);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <TimezoneToggle locale={mockLocale} />
    );
    
    expect(toJSON()).toMatchSnapshot();
  });
});