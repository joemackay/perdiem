import React from "react";
import { Text, TouchableOpacity, View } from 'react-native';
import { Button } from "./button";

interface datePickerType {
  daysArray: number[],
  currentDate: number,
  monthNumber: number,
  onDateSelected: (date: number) => void;
  onCancelled: () => void;
  testID?: string; // Added for unit testing purposes
}
const CustomDatePicker: React.FC<datePickerType> = ({ daysArray, currentDate, monthNumber, onDateSelected, onCancelled }) => {

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  return (
    <>
      <View className=' bg-gray-100 py-2' testID="test-dates-container">
        <View className="flex-row justify-between px-2">
          <Text className='text-center mt-2'>Select Date</Text>
          <Button onPress={onCancelled} className="bg-slate-500 w-15 h-10 text-center items-center" testID="test-date-picker-close-button"> X</Button>
        </View>
        <Text className='mr-2 text-black font-bold ml-2'>{months[monthNumber]}</Text>
        <View className='flex-wrap flex-row mt-2 pb-2'>
          {daysArray.map((day: number, index: number) => (
            <View key={index} className="bg-slate-200 rounded-md p-2 m-2 border-1 border-slate-400 w-12 h-12 justify-center items-center">
              <TouchableOpacity
                onPress={() => onDateSelected(day)}
                testID="test-date-button"
              >
                <Text className="text-gray-700 text-center text-lg">{String(day)}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

export default CustomDatePicker;