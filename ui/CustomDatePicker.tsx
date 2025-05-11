import React from "react";
import { Text, TouchableOpacity, View } from 'react-native';
import { Button } from "./button";

interface datePickerType {
  daysArray: number[],
  currentDate: number,
  monthTitle: string,
  onDateSelected: (date: number) => void;
  onCancelled: () => void;
}
const CustomDatePicker: React.FC<datePickerType> = ({ daysArray, currentDate, monthTitle, onDateSelected, onCancelled }) => {

  return (
    <>
      <View className=' bg-gray-100 py-2'>
        <View className="flex-row justify-between px-2">
          <Text className='text-center mt-2'>Select Date</Text>
          <Button onPress={onCancelled} className="bg-slate-500 w-15 h-10 text-center items-center"> X</Button>
        </View>
        <Text className='mr-2 text-black font-bold ml-2'>Month {monthTitle}</Text>
        <View className='flex-wrap flex-row mt-2 pb-2'>
          {daysArray.map((day, index) => (
            <View key={index} className="bg-slate-200 rounded-md p-2 m-2 border-1 border-slate-400 w-12 h-12 justify-center items-center">
              <TouchableOpacity
                onPress={() => onDateSelected(day)}
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