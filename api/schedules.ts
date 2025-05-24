
import { StoreScheduleType } from "@/types/storescheduletime";
import axios from "axios";
import { createQuery } from 'react-query-kit';
// const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const BASE_URL = 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com';
// src/api/storeApi.ts
const api_username = process.env.EXPO_PUBLIC_API_AUTH_USERNAME
const api_pass = process.env.EXPO_PUBLIC_API_AUTH_PASS

const queryOptions = {
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
};

export const fetchStoreSchedules = createQuery<StoreScheduleType[]>({
  queryKey: ['schedules'],
  fetcher: () =>  axios.get(`${BASE_URL}/store-times/`, { 
      headers: { 
        Authorization: `Basic ${btoa(`${api_username}:${api_pass}`)}` 
      } 
    }).then( res => res.data),
  ...queryOptions
})

export const fetchStoreScheduleOverrides = createQuery<StoreScheduleType[]>({
  queryKey: ['schedules'],
  fetcher: () =>  axios.get(`${BASE_URL}/store-overrides/`, { 
      headers: { 
        Authorization: `Basic ${btoa(`${api_username}:${api_pass}`)}` 
      } 
    }).then( res => res.data),
  ...queryOptions
})

// export const fetchStoreTimes = async (): Promise<StoreScheduleType[]> => {
//   console.log('fetchStoreTimes BASE_URL', `${BASE_URL}/store-times/`)
//   try {
//     const response = await axios.get(`${BASE_URL}/store-times/`);
//     console.log('response', response.data)
//     return response.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       if ((error as any).response?.data) {
//         throw (error as any).response.data;
//       }
//       throw error.message;
//     }
//     throw error;
//   }
// }

// export const fetchStoreOverrides = async (): Promise<StoreScheduleType[]> => {
//   console.log('fetchStoreOverrides BASE_URL', `${BASE_URL}/store-times/`)
//   try {
//     const response = await axios.get(BASE_URL + `/store-overrides/`, { 
//       headers: { 
//         Authorization: `Basic ${btoa(`${api_username}:${api_pass}`)}` 
//       } 
//     });
//     return response.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       if ((error as any).response?.data) {
//         throw (error as any).response.data;
//       }
//       throw error.message;
//     }
//     throw error;
//   }
// }