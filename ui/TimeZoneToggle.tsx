import { useSchedulesStore } from "@/store/schedules-store";
import React, { useState } from "react";
import { Switch, Text, View } from 'react-native';

interface timezoneType {
  locale: string
}
const TimezoneToggle: React.FC<timezoneType> = ({ locale }) => {
  const { timezone, setSelectedTimezone } = useSchedulesStore();
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleTimezone = () => {
    setIsEnabled(!isEnabled)
    setSelectedTimezone(isEnabled ? 'America/New_York' : locale);
  };

  return (
    <>
      <View className='bg-white flex-row justify-left items-center'>
        <Text className='mr-2 text-black'>{locale}</Text>
        <Switch
          value={timezone === 'America/New_York'}
          onValueChange={toggleTimezone}
        />
        <Text className='ml-2'>NYC Timezone</Text>
      </View>
    </>
  );
};

export default TimezoneToggle;