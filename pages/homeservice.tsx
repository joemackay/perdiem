import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAuthStore } from "../store/auth-store";
import { useSchedulesStore } from "../store/schedules-store";
// import Timezone from 'react-native-timezone';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Localization from 'expo-localization';
import { router } from "expo-router";
import PushNotification from 'react-native-push-notification';
import { Button } from "../ui/button";
import CustomDatePicker from "../ui/CustomDatePicker";
import TimeSlots from "../ui/TimeSlotsPicker";
import TimezoneToggle from "../ui/TimeZoneToggle";
import { generateMonthlySequence, generateTimeSchedules, getDateOrdinal } from '../utils/formatter';
// import messaging from '@react-native-firebase/messaging';

// This is the business logic of the homepage

const HomeService =()=> {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimeSlotPicker, setShowTimeSlotPicker] = useState(false)
  const userInfo = useAuthStore((state)=> state.user)
  const { logout } = useAuthStore()
  const currentMinute = new Date().getMinutes();
  const currentHour = new Date().getHours();
  const currentDay = new Date().getDate();
  const currentDate = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const { timezone, selectedTime, setSelectedDayOfTheMonth, setSelectedTime } = useSchedulesStore();
  const [myTimeZone, setMyTimeZone] = useState('')
  const [chosenDate, setChosenDate] = useState(0)
  const [chosenTime, setChosenTime] = useState('--')
  const [currentGreeting, setCurrentGreeting] = useState('None')
  const daysArray = generateMonthlySequence(currentDay)
  const timeSlotIntervals = generateTimeSchedules(Math.max(8, currentHour), currentMinute, (17-currentHour), 30);
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
    setSelectedDayOfTheMonth(dayOfTheMonth)
    setShowDatePicker(false);
    setChosenDate(dayOfTheMonth)
    setShowTimeSlotPicker(true)
    const ordinal = getDateOrdinal(dayOfTheMonth ?? 1)
    setDateOrdinal(ordinal);
  };

  const onDateSelectionCancelled = () => {
    setShowDatePicker(false)
  }

  const onSelectTime = (time: string) => {
    console.log('onSelectTime', onSelectTime)
    setSelectedTime(time)
    setChosenTime(time)
    setShowTimeSlotPicker(false)
    router.push('/details')
  }

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleLogout =async () => {
    logout()
    router.replace('/login')
    await GoogleSignin.revokeAccess();
    await auth().signOut();
  }

  useEffect(() => {
    const timezone = Localization.timezone;
    setMyTimeZone(timezone);
    setCurrentGreeting(greeting);
  }, [timezone, greeting, selectedTime]);

  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
        console.log('TOKEN:', token);
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // Process the notification based on its type
        if (notification.action === 'snooze') {
            // Handle snooze action
            console.log('User snoozed');
        } else if (notification.action === 'dismiss') {
            // Handle dismiss action
            console.log('User dismissed');
        }
        // (required) Called when you finish processing the notification.
        // Important for Android + iOS.
        notification.finish('background');
    },

    // (optional) Schedule local notification
    onAction: (notification) => {
        console.log('My Notification scheduled', notification);
    },

    // (optional) Called when the user fails to register for remote notifications.
    onRegistrationError: (err) => {
        console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: false
     * - Specified if permissions (iOS) and token (Android and iOS) will requested or not,
     * - if not, you must call PushNotification.requestPermissions() later
     */
    requestPermissions: true,
});

  useEffect(() => {
    console.log('selectedTime=======>', selectedTime)
    if (selectedTime) {
      // if saved time is "9:00 - 9:15" we split it to get the 9:15
      scheduleNotification(selectedTime.split(' - ')[1]);
    }
  }, [selectedTime])

  const scheduleNotification = (selectedTime: string) => {
    try {
      // 1. Convert selectedTime string to a Date object
      const [time, period] = selectedTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (period === 'PM' && hours !== 12) {
          hours += 12;
      } else if (period === 'AM' && hours === 12) {
          hours = 0;
      }

      const fireDate = new Date();
      fireDate.setHours(hours);
      fireDate.setMinutes(minutes);
      fireDate.setSeconds(0); // Ensure seconds are 0 for accuracy

      // 2.  Check if the fireDate is in the past
      const now = new Date();
      if (fireDate < now) {
          console.warn("Selected time is in the past.  Scheduling for tomorrow.");
          fireDate.setDate(fireDate.getDate() + 1); // Schedule for tomorrow
      }

      // 3. Schedule the notification
      PushNotification.scheduleLocalNotification({
          channelId: "scheduled-time-channel", // Make sure this channel ID matches the one you created
          title: "Time Reminder",
          message: `Your scheduled time is ${selectedTime}!`,
          date: fireDate, // Use the Date object
          allowWhileIdle: true, // Optional: Allow notification when the app is in background
          repeatType: 'day',
      });
      // console.log(`Notification scheduled for ${format(fireDate, 'yyyy-MM-dd HH:mm:ss')}`);

    } catch (error) {
        console.error("Error scheduling notification:", error);
    }
  };

  // Optional: Create notification channels (required for Android O and above)
  PushNotification.createChannel({
      channelId: "general", // (required)
      channelName: "General Notifications", // (required)
      channelDescription: "General notifications for the app", // (optional)
      soundName: "default", // (optional)
      importance: 4, // (optional) e.g. Importance.HIGH - see node_modules/react-native-push-notification/lib/constants.js
      vibrate: true, // (optional)
  },
      (created) => console.log(`Channel created: ${created}`) // (optional) callback
  );
  const handleSendNotification = () => {
          // Use PushNotification.localNotification to send an immediate notification
          PushNotification.localNotification({
              channelId: "general", //  Use the general channel
              title: "Immediate Notification", // Notification title
              message: "This is a notification sent immediately!", // Notification message
              playSound: true,
              soundName: 'default'
          });
          console.log('Notification sent immediately!');
      };

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
              <Button
                onPress={()=>handleLogout()}
                testID="test-logout-button">Logout</Button>
            </View>
            {/* <View className="ml-2"><Text>{userInfo?.picture}</Text></View>  */}
          </View>
          <View className="flex-col mb-4 bg-white  shadow-sm p-2">
            <Text className="text-md mb-6">What is your preferred timezone?</Text>
            <TimezoneToggle locale={myTimeZone} />
          </View>
          
          <View className="flex-col mb-4 bg-white  shadow-sm p-2">
            <Button className="bg-blue-500 w-48" onPress={handleSendNotification}>Send notification</Button>
          </View>
          
          <View className="flex-col mb-4 bg-white  shadow-sm p-2">
            <View className="flex-row justify-between">
              {!showDatePicker && !showTimeSlotPicker && 
                <Button onPress={showDatepicker}
                  className="bg-blue-500"
                  testID="test-select-date-button">Select Date</Button>}
              <Text className="pt-3">
                {chosenDate > 0 ? (
                  <>
                    You selected {chosenDate}{dateOrdinal} at {chosenTime}
                  </>
                ): null }
                
              </Text>
            </View>
            <View className="mt-4 bg-white">
              {showDatePicker ? (
                <CustomDatePicker
                  daysArray={daysArray.map(dayObj => dayObj.number)}
                  currentDate={currentDate}
                  onDateSelected={onSelectDate}
                  onCancelled={onDateSelectionCancelled}
                  monthNumber={currentMonth}
                  testID="test-custom-date-picker"
                />
                )
              : null}
              {showTimeSlotPicker ? (
                // Display available slots until 6pm
                <TimeSlots
                  slotArray={timeSlotIntervals}
                  onTimeSlotSelected={onSelectTime}
                  testID="test-time-slots"
                />
              ): null}
            </View>
          </View>
        </View>
      </View>
    </>
  )
}
export default HomeService;