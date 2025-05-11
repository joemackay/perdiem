import axios, { isAxiosError } from 'axios';

const BASE_URL = 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com';

export const loginWithEmail = async (email: string, password:string) => {
  console.log('loginWithEmail')
  try {
    const response = await client.post(`${BASE_URL}/auth/`, {
      email,
      password,
    });
    const payload = {
      ...response.data,
      fname: "Joe",
      lname: "Smitch",
      picture: "ajkhdgfka",
      email
    }
    return payload
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

export const signupWithEmail = async (names: string, phone: string, email: string, password:string) => {
  console.log('loginWithEmail')
  try {
    const response = await client.post(`${BASE_URL}/auth/`, {
      names,
      phone,
      email,
      password,
    });
    const payload = {
      ...response.data,
      fname: "Joe",
      lname: "Smitch",
      picture: "ajkhdgfka",
      email
    }
    return payload
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

export const client = axios.create({
  baseURL: BASE_URL,
});

// client.interceptors.request.use(async (config) => {
//   const token = await getValidToken();
//   config.headers['x-access-token'] = token;
//   return config;
// });
