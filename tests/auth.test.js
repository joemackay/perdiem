import { loginWithEmail } from '@/api/auth';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import axios from 'axios';

jest.mock('axios'); // Mock Axios

describe('loginWithEmail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sends email/password to the correct endpoint and returns data on success', async () => {
    // Mock a successful response
    const mockResponse = { data: { id: 1, name: 'Test User' } };
    axios.post.mockResolvedValue(mockResponse);

    const email = 'user@tryperdiem.com';
    const password = 'password';
    const result = await loginWithEmail(email, password);

    // Verify Axios called the right endpoint with correct data
    expect(axios.post).toHaveBeenCalledWith(
      'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com/',
      { email, password }
    );

    // Verify the function returns the expected data
    expect(result).toEqual(mockResponse.data);
  });

  it('throws an error on failure', async () => {
    // Mock a failed response
    const errorMessage = 'Invalid credentials';
    axios.post.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    await expect(loginWithEmail('wrong@test.com', 'wrongpass')).rejects.toThrow(
      errorMessage
    );
  });

  it('throws a generic error if no server message exists', async () => {
    axios.post.mockRejectedValue(new Error('Network error'));
    await expect(loginWithEmail('test@test.com', 'pass')).rejects.toThrow(
      'Login failed'
    );
  });
});