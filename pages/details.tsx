import { fetchStoreOverrides, fetchStoreTimes } from "@/api/schedules";
import { useSchedulesStore } from "@/store/schedules-store";
import { Button } from "@/ui/button";
import { getDateOrdinal, timeToMinutes } from "@/utils/formatter";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
const DetailsService =() => {
  const [storeAvailability, setStoreAvailability] = useState(false)
  const { storeSchedules, storeScheduleOverides, selectedDayOfTheMonth, selectedTime, setSchedules, setScheduleOverides } = useSchedulesStore()
  const [dateOrdinal, setDateOrdinal] = useState('')
  
  useEffect(() => {

    const ordinal = getDateOrdinal(selectedDayOfTheMonth ?? 1)
    setDateOrdinal(ordinal);

    const fetchSchedules = async () => {
    const schedules = await fetchStoreTimes();
    setSchedules(schedules);
    const scheduleOverrides = await fetchStoreOverrides();
    setScheduleOverides(scheduleOverrides);
  };
    fetchSchedules();

    //convert the selected time to minutes for easy comparison
    const selectedTimeMinutes = selectedTime ? timeToMinutes(selectedTime) : 0;

    let isAvailable = storeSchedules.some((schedule) => {
      return timeToMinutes(schedule.start_time) >= selectedTimeMinutes && 
      selectedTimeMinutes <= timeToMinutes(schedule.end_time) && 
      schedule.day_of_week===selectedDayOfTheMonth && 
      schedule.is_open;
    })
    isAvailable = storeScheduleOverides.some((schedule) => {
      return timeToMinutes(schedule.start_time) >= selectedTimeMinutes && 
      selectedTimeMinutes <= timeToMinutes(schedule.end_time) && 
      schedule.day_of_week===selectedDayOfTheMonth && 
      schedule.is_open;
    })
    setStoreAvailability(isAvailable)
  }, []);
  return (
    <View className="flex-1 m-2 bg-gray-100 p-2">
      <View className="m-2 p-2 bg-white shadow-sm">
        <Text className="text-xl text-bold">Store availability</Text>
        <Text>The store is {storeAvailability ? 'Open' : 'Closed'} on {selectedDayOfTheMonth}{dateOrdinal} from {selectedTime}</Text>
        <View className="my-2">
          <View className={`rounded-md w-10 h-10 ${storeAvailability ? 'bg-green-600' : 'bg-red-600'} `}></View>
        </View>
        <Button className="rounded-md w-32" onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    </View>
  )
}

export default DetailsService;