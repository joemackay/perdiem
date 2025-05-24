import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { fetchStoreScheduleOverrides, fetchStoreSchedules } from "../api/schedules";
import { useSchedulesStore } from "../store/schedules-store";
import { Button } from "../ui/button";
import { getDateOrdinal, timeToMinutes } from "../utils/formatter";

// The business logic of details page
const DetailsService =() => {
  const [storeAvailability, setStoreAvailability] = useState(false)
  const { storeSchedules, storeScheduleOverides, selectedDayOfTheMonth, selectedTime, setSchedules, setScheduleOverides } = useSchedulesStore()
  const [dateOrdinal, setDateOrdinal] = useState('')
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState<Error | null>(null)
  
  const { data: schedules, isLoading, error, refetch } = fetchStoreSchedules();
  // setIsLoading(isLoading)
  // setError(error)

  const { data: scheduleOverrides } = fetchStoreScheduleOverrides();
  useEffect(() => {
    console.log('schedules', schedules)
    setSchedules(schedules ?? []);
    setScheduleOverides(scheduleOverrides ?? []);
    console.log('scheduleOverrides', scheduleOverrides)

    const ordinal = getDateOrdinal(selectedDayOfTheMonth ?? 1)
    setDateOrdinal(ordinal);

    // const fetchSchedules = () => {
        
    // }
    // fetchSchedules();

    //convert the selected time to minutes for easy comparison
    // if saved time is "9:00 - 9:15" we split it to get the 9:15
    const selectedTimeMinutesStart = selectedTime ? timeToMinutes(selectedTime.split(' - ')[0]) : 0;
    const selectedTimeMinutesEnd = selectedTime ? timeToMinutes(selectedTime.split(' - ')[1]) : 0;

    let isAvailable = storeSchedules.some((schedule) => {
      return timeToMinutes(schedule.start_time) >= selectedTimeMinutesStart && 
      selectedTimeMinutesEnd <= timeToMinutes(schedule.end_time) && 
      schedule.day_of_week===selectedDayOfTheMonth && 
      schedule.is_open;
    })
    isAvailable = storeScheduleOverides.some((schedule) => {
      return timeToMinutes(schedule.start_time) >= selectedTimeMinutesStart && 
      selectedTimeMinutesEnd <= timeToMinutes(schedule.end_time) && 
      schedule.day_of_week===selectedDayOfTheMonth && 
      schedule.is_open;
    })
    setStoreAvailability(isAvailable)
  }, [scheduleOverrides, schedules, selectedDayOfTheMonth, selectedTime]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#024F63" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-white text-lg">Error loading members. Please try again.</Text>
        <TouchableOpacity onPress={() => refetch()} className="mt-4 bg-blue-500 p-2 rounded">
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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