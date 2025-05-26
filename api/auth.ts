import axios, { isAxiosError } from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const client = axios.create({
  baseURL: BASE_URL,
});

/**
 * Login with form
 * @param email 
 * @param password 
 * @returns 
 */
export const loginWithEmail = async (email: string, password:string) => {

  try {
    const response = await axios.post(`${BASE_URL}/auth/`, {
      email,
      password,
    });
    const payload = {
      ...response.data,
      fname: "Joe",
      lname: "Smith",
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


/**
 * Sign up with form
 * @param names 
 * @param phone 
 * @param email 
 * @param password 
 * @returns 
 */
export const signupWithEmail = async (names: string, phone: string, email: string, password:string) => {
  console.log('loginWithEmail')
  try {
    const response = await axios.post(`${BASE_URL}/auth/`, {
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

// client.interceptors.request.use(async (config) => {
//   const token = await getValidToken();
//   config.headers['x-access-token'] = token;
//   return config;
// });
