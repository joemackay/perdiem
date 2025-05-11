// import React from 'react';
// import { render, fireEvent } from '@testing-library/react-native';
// import Button from '@/ui/button'
// import { describe, expect, it, jest, getByTestId } from '@jest/globals';

// describe('Button Component', () => {
//   it('renders correctly', () => {
//     const { getByTestId } = render(<Button onPress={() => {}} >Click Me</Button>);
//     expect(getByTestId('button')).toBeTruthy();
//     expect(getByTestId('button-text')).toHaveTextContent('Click Me');
//   });

//   it('calls onPress when clicked', () => {
//     const mockOnPress = jest.fn();
//     const { getByTestId } = render(<Button onPress={mockOnPress}>Press</Button>);
    
//     fireEvent.press(getByTestId('button'));
//     expect(mockOnPress).toHaveBeenCalled();
//   });
// });