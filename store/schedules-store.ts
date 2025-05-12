// stores/authStore.ts
import { StoreScheduleType } from '@/types/storescheduletime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Store the state of time schedules of the shop
type ScheduleState = {
  timezone: string | null;
  selectedDayOfTheMonth: number | null;
  selectedTime: string | null;
  storeSchedules: StoreScheduleType[];
  storeScheduleOverides: StoreScheduleType[];
  setSelectedTimezone: (tz: string) => void;
  setSelectedDayOfTheMonth: (date: number) => void,
  setSelectedTime: (time: string) => void,
  setSchedules: (schedules: StoreScheduleType[]) => void,
  setScheduleOverides: (schedules: StoreScheduleType[]) => void
};

export const useSchedulesStore = create<ScheduleState>()(
  persist(
    (set) => ({
      //the default timezone
      timezone: null,

      // number format day of the week
      selectedDayOfTheMonth: null,

      // store selected time for use in other pages
      selectedTime: null,

      // store the list of schedules 
      storeSchedules: [],

      // store the list of schedule overides
      storeScheduleOverides: [],
      setSelectedTimezone: (tz: string) => {
        set({ timezone: tz })
      },
      setSelectedDayOfTheMonth: (date: number) => {
        set({ selectedDayOfTheMonth: date })
      },
      setSelectedTime: (time: string) => {
        set({ selectedTime: time })
      },
      setSchedules: (schedules: StoreScheduleType[]) => {
        set({storeSchedules : schedules})
      },
      setScheduleOverides: (schedules: StoreScheduleType[]) => {
        set({storeScheduleOverides : schedules})
      }
    }),
    { name: 'schedules-storage',
      storage: createJSONStorage(() => AsyncStorage), // Explicitly use AsyncStorage 
      }
  )
);
