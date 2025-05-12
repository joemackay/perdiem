import CustomDatePicker from '@/ui/CustomDatePicker';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('CustomDatePicker', () => {
  const mockDaysArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const mockCurrentDate = 5;
  const mockMonthTitle = '11';
  const mockOnDateSelected = jest.fn();
  const mockOnCancelled = jest.fn();

  it('renders correctly with all props', () => {
    const { getByText, getAllByText, getByTestId } = render(
      <CustomDatePicker
        daysArray={mockDaysArray}
        currentDate={mockCurrentDate}
        monthTitle={mockMonthTitle}
        onDateSelected={mockOnDateSelected}
        onCancelled={mockOnCancelled}
      />
    );

    // Check header elements
    expect(getByText('Select Date')).toBeTruthy();
    expect(getByText('Month 11')).toBeTruthy();
    expect(getByTestId('test-date-picker-close-button')).toBeTruthy();

    // Check all days are rendered
    mockDaysArray.forEach(day => {
      expect(getByText(String(day))).toBeTruthy();
    });
  });

  it('calls onDateSelected with correct day when a date is pressed', () => {
    const { getByText } = render(
      <CustomDatePicker
        daysArray={mockDaysArray}
        currentDate={mockCurrentDate}
        monthTitle={mockMonthTitle}
        onDateSelected={mockOnDateSelected}
        onCancelled={mockOnCancelled}
      />
    );

    // Test clicking on day 3
    fireEvent.press(getByText('3'));
    expect(mockOnDateSelected).toHaveBeenCalledWith(3);

    // Test clicking on day 8
    fireEvent.press(getByText('8'));
    expect(mockOnDateSelected).toHaveBeenCalledWith(8);
  });

  it('calls onCancelled when close button is pressed', () => {
    const { getByTestId } = render(
      <CustomDatePicker
        daysArray={mockDaysArray}
        currentDate={mockCurrentDate}
        monthTitle={mockMonthTitle}
        onDateSelected={mockOnDateSelected}
        onCancelled={mockOnCancelled}
      />
    );

    fireEvent.press(getByTestId('test-date-picker-close-button'));
    expect(mockOnCancelled).toHaveBeenCalled();
  });

  it('renders all days in the array', () => {
    const { getAllByTestId } = render(
      <CustomDatePicker
        daysArray={mockDaysArray}
        currentDate={mockCurrentDate}
        monthTitle={mockMonthTitle}
        onDateSelected={mockOnDateSelected}
        onCancelled={mockOnCancelled}
      />
    );

    // Each date has a testID="date-button"
    const dateButtons = getAllByTestId('test-date-button');
    expect(dateButtons.length).toBe(mockDaysArray.length);
  });

  // it('applies correct styling to date buttons', () => {
  //   const { getByText } = render(
  //     <CustomDatePicker
  //       daysArray={mockDaysArray}
  //       currentDate={mockCurrentDate}
  //       monthTitle={mockMonthTitle}
  //       onDateSelected={mockOnDateSelected}
  //       onCancelled={mockOnCancelled}
  //     />
  //   );

  //   const dateButton = getByText('1').parent;
  //   // Check basic styling (note: RNTL can't directly check className)
  //   expect(dateButton.props.style).toEqual(
  //     expect.objectContaining({
  //       borderRadius: expect.any(Number),
  //       padding: expect.any(Number),
  //     })
  //   );
  // });

  it('handles empty daysArray gracefully', () => {
    const { queryByTestId } = render(
      <CustomDatePicker
        daysArray={[]}
        currentDate={mockCurrentDate}
        monthTitle={mockMonthTitle}
        onDateSelected={mockOnDateSelected}
        onCancelled={mockOnCancelled}
      />
    );

    const container = queryByTestId('test-dates-container');
    expect(container?.children).toBeTruthy(); // Container exists
    // expect(container?.children.length).toBe(1); // Only the View wrapper with no dates
  });
});