import { API_AUTH } from "@/constants/ApiKeys";
import { StoreScheduleType } from "@/types/storescheduletime";
import { client } from "./auth";
// src/api/storeApi.ts

export const fetchStoreTimes = async (): Promise<StoreScheduleType[]> => {
  try {
    const response = await client.get(`/store-times/`, { 
      headers: { 
        Authorization: `Basic ${btoa(`${API_AUTH.username}:${API_AUTH.password}`)}` 
      } 
    });
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
  try {
    const response = await client.get(`/store-overrides/`, { 
      headers: { 
        Authorization: `Basic ${btoa(`${API_AUTH.username}:${API_AUTH.password}`)}` 
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