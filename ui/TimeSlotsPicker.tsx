import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
      <View className="pb-safe-offset-10 border-2 border-gray-400 rounded-md p-2 m-2">
        {/* Box title section */}
        <View className="flex-row justify-between px-2">
          <View>
            <Text className="text-start text-lg text-blue-600">Available Time Slots</Text>
            <Text className="text-start text-sm text-gray-500">Tap to select, Scroll to see more</Text>
          </View>
          <Button onPress={() => onTimeSlotCancelled()} className="bg-slate-500 w-12 h-10 text-center items-center" testID="test-date-picker-close-button"> X</Button>
        </View>
        
        <View>
          {/* Render time slots */}
          <View className='flex-wrap flex-col'>
            {slotArray?.map((slot, index) => (
              <View key={index} className="bg-white rounded-md p-1 m-1 border-2 border-blue-400 w-40 h-10 justify-center items-center">
                <TouchableOpacity
                  onPress={() => onTimeSlotSelected(slot)}
                >
                  <Text className="text-gray-700 text-center text-md">{slot}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

export default TimeSlots;