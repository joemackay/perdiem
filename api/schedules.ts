
import { StoreScheduleType } from "@/types/storescheduletime";
import axios from "axios";
// const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const BASE_URL = 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com';
// src/api/storeApi.ts
const api_username = process.env.EXPO_PUBLIC_API_AUTH_USERNAME
const api_pass = process.env.EXPO_PUBLIC_API_AUTH_PASS
export const fetchStoreTimes = async (): Promise<StoreScheduleType[]> => {
  console.log('fetchStoreTimes BASE_URL', `${BASE_URL}/store-times/`)
  try {
    const response = await axios.get(`${BASE_URL}/store-times/`);
    console.log('response', response.data)
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      if ((error as any).response?.data) {
        throw (error as any).response.data;
      }
      throw error.message;
    }
    throw error;
  }
}

export const fetchStoreOverrides = async (): Promise<StoreScheduleType[]> => {
  console.log('fetchStoreOverrides BASE_URL', `${BASE_URL}/store-times/`)
  try {
    const response = await axios.get(BASE_URL + `/store-overrides/`, { 
      headers: { 
        Authorization: `Basic ${btoa(`${api_username}:${api_pass}`)}` 
      } 
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      if ((error as any).response?.data) {
        throw (error as any).response.data;
      }
      throw error.message;
    }
    throw error;
  }
}


// interface StoreResponse {
//   status: string;
//   data: StoreTime[];
// }
// const queryOptions = {
//   refetchOnWindowFocus: false,
//   refetchOnReconnect: false,
//   refetchOnMount: false,
// };

// export const useFetchStoreTimes = createQuery<StoreTime[], { merchantId: string, branchId: string }>({
//   queryKey: ['merchantMembers'],
//   fetcher: () => 
//     client.get(`/store-times/`).then(response => response.data.data),
//   ...queryOptions,
// });

// export const useFetchStoreTime = createQuery<StoreTime[], { id: string, branchId: string }>({
//   queryKey: ['merchantMembers'],
//   fetcher: ({ id }) => 
//     client.get(`/store-times/`).then(response => response.data.data),
//   ...queryOptions,
// });