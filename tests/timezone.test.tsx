import { useSchedulesStore } from '@/store/schedules-store';
import TimezoneToggle from '@/ui/TimeZoneToggle';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

// Mock the Zustand store
jest.mock('@/store/schedules-store');

describe('TimezoneToggle', () => {
  const mockSetSelectedTimezone = jest.fn();
  const mockLocale = 'Europe/London';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the schedules store
    (useSchedulesStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector === jest.fn()) {
        return {
          timezone: 'America/New_York',
          setSelectedTimezone: mockSetSelectedTimezone,
        };
      }
      return {};
    });
  });

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

  it('displays switch in correct position based on timezone', () => {
    // Test when timezone is NYC
    (useSchedulesStore as unknown as jest.Mock).mockImplementation((selector) => ({
      timezone: 'America/New_York',
      setSelectedTimezone: mockSetSelectedTimezone,
    }));
    
    const { getByTestId, rerender } = render(
      <TimezoneToggle locale={mockLocale} />
    );
    
    const switchElement = getByTestId('test-tz-switch');
    expect(switchElement.props.value).toBe(true);

    // Test when timezone is not NYC
    (useSchedulesStore as unknown as jest.Mock).mockImplementation((selector) => ({
      timezone: 'Europe/London',
      setSelectedTimezone: mockSetSelectedTimezone,
    }));
    
    rerender(<TimezoneToggle locale={mockLocale} />);
    expect(switchElement.props.value).toBe(false);
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