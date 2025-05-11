import { useAuthStore } from "@/store/auth-store";
import { useSchedulesStore } from "@/store/schedules-store";
import React, { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
// import Timezone from 'react-native-timezone';
import { Button } from "@/ui/button";
import CustomDatePicker from "@/ui/CustomDatePicker";
import TimeSlots from "@/ui/TimeSlotsPicker";
import TimezoneToggle from "@/ui/TimeZoneToggle";
import { generate24HourIntervals, generateMonthlySequence, getDateOrdinal } from '@/utils/formatter';
import * as Localization from 'expo-localization';
import { router } from "expo-router";



const HomeService =()=> {
// const [date, setDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimeSlotPicker, setShowTimeSlotPicker] = useState(false)
  const userInfo = useAuthStore((state)=> state.user)
  const { logout } = useAuthStore()
  const currentHour = new Date().getHours();
  const currentDay = new Date().getDate();
  const currentDate = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const { timezone, selectedTime, setSelectedDayOfTheMonth, setSelectedTime } = useSchedulesStore();
  const [myTimeZone, setMyTimeZone] = useState('')
  const [chosenDate, setChosenDate] = useState(0)
  const [chosenTime, setChosenTime] = useState('None')
  const [currentGreeting, setCurrentGreeting] = useState('None')
  const daysArray = generateMonthlySequence(currentDay)
  const timeSlotIntervals = generate24HourIntervals(8, 0, 12);
  const [dateOrdinal, setDateOrdinal] = useState('')

  const myTimezone = Localization.timezone;
  const myCity = myTimezone?.split('/')[1]
  let greeting = '';
  if (currentHour > 5 && currentHour < 10) {
    greeting = `Good morning, ${myCity}!`;
  } else if (currentHour >= 10 && currentHour < 12) {
    greeting = `Late morning, ${myCity}!`;
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = `Good afternoon, ${myCity}!`;
  } else if (currentHour >= 17 && currentHour < 21) {
    greeting = `Good evening, ${myCity}!`;
  } else if (currentHour < 5) {
    greeting = `Night Owl in ${myCity}!`;
  }

  const onSelectDate = (dayOfTheMonth: number) => {
    setShowDatePicker(Platform.OS === 'ios'); // iOS stays open, Android closes
    // setDate(new Date());
    setSelectedDayOfTheMonth(dayOfTheMonth)
    setShowDatePicker(false);
    setChosenDate(dayOfTheMonth)
    setShowTimeSlotPicker(true)
    const ordinal = getDateOrdinal(dayOfTheMonth ?? 1)
    setDateOrdinal(ordinal);
  };

  const onSelectTime = (time: string) => {
    setSelectedTime(time)
    setChosenTime(time)
    setShowTimeSlotPicker(false)
    console.log('time', time)
    router.push('/details')
  }

  const showDatepicker = () => {
    console.log('showDatepicker')
    setShowDatePicker(true);
  };

  const handleLogout =() => {
    logout()
    router.replace('/login')
  }

  useEffect(() => {
      const timezone = Localization.timezone;
      setMyTimeZone(timezone);
      setCurrentGreeting(greeting);
      console.log('selectedTime', selectedTime)
      // setUserInfo(user)
    }, [timezone, greeting, selectedTime]);
  return (
    <>
      {/* <SafeAreaView> */}
      <View className="flex-1 bg-gray-100">
        <View className="p-2 h-full">
          <View className="flex-row justify-between mt-2 mb-4 bg-white shadow-sm p-2">
            <View>
              <Text className="text-2xl text-bold text-black">{userInfo?.fname}</Text>
              <Text className="text-md">{currentGreeting}</Text>
            </View>
            <View>
              <Button onPress={()=>handleLogout()}>Logout</Button>
            </View>
            {/* <View className="ml-2"><Text>{userInfo?.picture}</Text></View>  */}
          </View>
          <View className="flex-col mb-4 bg-white  shadow-sm p-2">
            <Text className="text-md mb-6">What is your preferred timezone?</Text>
            <TimezoneToggle locale={myTimeZone} />
          </View>
          
          <View className="flex-col mb-4 bg-white  shadow-sm p-2">
            <View className="flex-row justify-between">
              {!showDatePicker && !showTimeSlotPicker && <Button onPress={showDatepicker} className="bg-blue-300">Select Date</Button>}
              <Text className="pt-3">
                {chosenDate > 0 ? (
                  <>
                    Chose {chosenDate}{dateOrdinal} at {chosenTime}
                  </>
                ): null }
                
              </Text>
            </View>
            <View className="mt-4 bg-white">
              {showDatePicker && 
                (
                  <CustomDatePicker
                  daysArray={daysArray.map(dayObj => dayObj.number)}
                  currentDate={currentDate}
                  onDateSelected={onSelectDate}
                  monthTitle={currentMonth.toString()}
                />
                )
              }
            </View>
            {showTimeSlotPicker ? (
              <TimeSlots
                slotArray={timeSlotIntervals}
                onTimeSlotSelected={onSelectTime}
              />
            ): null}
          </View>
        </View>
      </View>
    </>
  )
}
export default HomeService;