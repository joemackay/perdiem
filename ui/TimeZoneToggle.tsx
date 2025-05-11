import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from "@/components/ThemedView";
import { useAuthStore } from '@/store/auth-store';
import { useSchedulesStore } from "@/store/schedules-store";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch } from 'react-native';

interface timezoneType {
  locale: string
}
const TimezoneToggle: React.FC<timezoneType> = ({ locale }) => {
  const { timezone, setSelectedTimezone } = useSchedulesStore();
  const [isEnabled, setIsEnabled] = useState(true);
  const { user } = useAuthStore()

  const toggleTimezone = () => {
    setIsEnabled(!isEnabled)
    console.log('1. isEnabled', isEnabled)
    setSelectedTimezone(isEnabled ? 'America/New_York' : locale);
    console.log('2. locale', timezone)
  };

  useEffect(()=>{
    console.log('3. stored timezone', timezone)
    console.log('4. user', user)
  }, [timezone])

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText className='mr-2 text-black'>{locale}</ThemedText>
        <Switch
          value={timezone === 'America/New_York'}
          onValueChange={toggleTimezone}
        />
        <ThemedText className='ml-2'>NYC Timezone</ThemedText>
      </ThemedView>
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


export default TimezoneToggle;