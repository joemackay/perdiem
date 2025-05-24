import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button } from "./button";

interface slotProps {
  slotArray: string[],
  onTimeSlotSelected: (slot: string) => void
  onTimeSlotCancelled: () => void
  testID? :string
}
const TimeSlots:React.FC<slotProps> =({ slotArray, onTimeSlotSelected, onTimeSlotCancelled }) => {
  console.log('TimeSlots called')
  console.log('slotArray', slotArray)
  return (
    <View>
      <View className="flex-row justify-between px-2">
        <Text className='text-center mt-2'>Select Time</Text>
        <Button onPress={() => onTimeSlotCancelled()} className="bg-slate-500 w-15 h-10 text-center items-center" testID="test-date-picker-close-button"> X</Button>
      </View>
      <View className="mb-80">
        <ScrollView>
          <View className='flex-wrap flex-col'>
            {slotArray?.map((slot, index) => (
              <View key={index} className="bg-white rounded-md p-2 m-2 border-2 border-blue-400 w-56 h-12 justify-center items-center">
                <TouchableOpacity
                  onPress={() => onTimeSlotSelected(slot)}
                >
                  <Text className="text-black text-center text-lg">{slot}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default TimeSlots;