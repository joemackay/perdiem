import React, { useState } from "react";
import { Switch, Text, View } from 'react-native';
import { useSchedulesStore } from "../store/schedules-store";

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
      <View className='bg-white flex-row justify-left items-center' testID="test-tz-container">
        <Text className='mr-2 text-black' testID="test-tz-locale">{locale}</Text>
        <Switch
          value={timezone === 'America/New_York'}
          onValueChange={toggleTimezone}
          testID="test-tz-switch"
        />
        <Text className='ml-2'>NYC Timezone</Text>
      </View>
    </>
  );
};

export default TimezoneToggle;