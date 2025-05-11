import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface slotProps {
  slotArray: string[],
  onTimeSlotSelected: (slot: string) => void
}
const TimeSlots:React.FC<slotProps> =({ slotArray, onTimeSlotSelected }) => {
  return (
    <View>
      <Text>Select Time</Text>
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