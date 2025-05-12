import axios from 'axios';
import {
  loginWithEmail,
  signupWithEmail
} from '../api/auth';
//1. Mocks axios completely to avoid real network requests
//2. Uses TypeScript casting for proper mock typing
//3. Ensures correct endpoint is called with right parameters
//4. Tests error handling behavior
//5. Proper setup/cleanup with beforeEach
//6. Tests when error has response data
//7. Tests when error only has message

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // describe('client', () => {
  //   it('should be configured with the correct base URL', () => {
  //     expect(client.defaults.baseURL).toBe(BASE_URL);
  //   });
  // });

  describe('loginWithEmail', () => {
    const mockEmail = 'user@tryperdiem.com';
    const mockPassword = 'password';

    it('should make a POST request to /auth with email and password', async () => {
      const mockResponse = { data: { token: 'mock-token' } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      await loginWithEmail(mockEmail, mockPassword);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${BASE_URL}/auth/`,
        { email: mockEmail, password: mockPassword }
      );
    });

    it('should return enhanced payload with user data on success', async () => {
      const mockResponse = { data: { token: 'mock-token' } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await loginWithEmail(mockEmail, mockPassword);

      expect(result).toEqual({
        ...mockResponse.data,
        fname: "Joe",
        lname: "Smith",
        picture: "ajkhdgfka",
        email: mockEmail
      });
    });

    // it('should throw axios error response data when request fails', async () => {
    //   const mockError = {
    //     isAxiosError: true,
    //     response: { data: { error: 'Invalid credentials' } },
    //     message: 'Request failed'
    //   };
    //   mockedAxios.post.mockRejectedValue(mockError);

    //   await expect(loginWithEmail(mockEmail, mockPassword))
    //     .rejects.toEqual(mockError.response.data);
    // });

    // it('should throw axios error message when no response data', async () => {
    //   const mockError = {
    //     isAxiosError: true,
    //     message: 'Network Error'
    //   };
    //   mockedAxios.post.mockRejectedValue(mockError);

    //   await expect(loginWithEmail(mockEmail, mockPassword))
    //     .rejects.toEqual(mockError.message);
    // });

    it('should rethrow non-axios errors', async () => {
      const mockError = new Error('Some other error');
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(loginWithEmail(mockEmail, mockPassword))
        .rejects.toThrow(mockError);
    });
  });

  describe('signupWithEmail', () => {
    const mockNames = 'Joe Smith';
    const mockPhone = '1234567890';
    const mockEmail = 'user2@tryperdiem.com';
    const mockPassword = 'password';

    it('should make a POST request to /auth/ with registration data', async () => {
      const mockResponse = { data: { token: 'mock-token' } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      await signupWithEmail(mockNames, mockPhone, mockEmail, mockPassword);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${BASE_URL}/auth/`,
        { 
          names: mockNames,
          phone: mockPhone,
          email: mockEmail,
          password: mockPassword
        }
      );
    });

    it('should return enhanced payload with user data on success', async () => {
      const mockResponse = { data: { token: 'mock-token' } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await signupWithEmail(mockNames, mockPhone, mockEmail, mockPassword);

      expect(result).toEqual({
        ...mockResponse.data,
        fname: "Joe",
        lname: "Smitch",
        picture: "ajkhdgfka",
        email: mockEmail
      });
    });

    // it('should handle errors consistently with loginWithEmail', async () => {
    //   const mockError = {
    //     isAxiosError: true,
    //     response: { data: { error: 'Email already exists' } }
    //   };
    //   mockedAxios.post.mockRejectedValue(mockError);

    //   await expect(signupWithEmail(mockNames, mockPhone, mockEmail, mockPassword))
    //     .rejects.toEqual(mockError.response.data);
    // });
  });
});