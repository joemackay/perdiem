import { useAuthStore } from '@/store/auth-store';
import { useSchedulesStore } from "@/store/schedules-store";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface datePickerType {
  daysArray: number[],
  currentDate: number,
  monthTitle: string,
  onDateSelected: (date: number) => void;
}
const CustomDatePicker: React.FC<datePickerType> = ({ daysArray, currentDate, monthTitle, onDateSelected }) => {
  const { timezone, setSelectedTimezone } = useSchedulesStore();
  const [isEnabled, setIsEnabled] = useState(true);
  const { user } = useAuthStore()

  const toggleTimezone = () => {
    setIsEnabled(!isEnabled)
    console.log('1. isEnabled', isEnabled)
    // setSelectedTimezone(isEnabled ? 'America/New_York' : locale);
    console.log('2. locale', timezone)
  };

  useEffect(()=>{
    console.log('3. stored timezone', timezone)
    console.log('4. user', user)
  }, [timezone])

  return (
    <>
      <View className='flex-1 bg-white'>
        <Text className='mr-2 text-black'>{monthTitle}</Text>
        <View className='flex-wrap flex-row bg-white'>
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

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});


export default CustomDatePicker;