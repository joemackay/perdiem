import { client } from '../api/auth';
import { fetchStoreOverrides, fetchStoreTimes } from '../api/schedules';

// Mock the client and btoa
jest.mock('../api/auth');

// Mock btoa
global.btoa = jest.fn((str) => `base64-${str}`);

const mockedClient = client as jest.Mocked<typeof client>;

describe('storeApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchStoreTimes', () => {
    const mockStoreTimes = 
      {
        "id": "27327da4-9dac-4c63-8237-8ef05333422a",
        "day": 20,
        "month": 4,
        "is_open": false,
        "start_time": "10:00",
        "end_time": "10:00"
      }
    ;

    it('should return store times data on success', async () => {
      mockedClient.get.mockResolvedValue({ data: mockStoreTimes });

      const result = await fetchStoreTimes();
      expect(result[0]).toEqual(mockStoreTimes);
    });

    it('should rethrow non-Error exceptions', async () => {
      const mockError = 'Some string error';
      mockedClient.get.mockRejectedValue(mockError);

      await expect(fetchStoreTimes()).rejects.toEqual(mockError);
    });
  });

  describe('fetchStoreOverrides', () => {
    const mockStoreOverrides = {
        "id": "27327da4-9dac-4c63-8237-8ef05333422a",
        "day": 20,
        "month": 4,
        "is_open": false,
        "start_time": "10:00",
        "end_time": "10:00"
      };

    it('should return store overrides data on success', async () => {
      mockedClient.get.mockResolvedValue({ data: mockStoreOverrides });

      const result = await fetchStoreOverrides();
      expect(result[0]).toEqual(mockStoreOverrides);
    });

    it('should handle errors consistently with fetchStoreTimes', async () => {
      const mockError = {
        response: { data: { error: 'Not Found' } },
        message: 'Request failed'
      };
      mockedClient.get.mockRejectedValue(mockError);

      await expect(fetchStoreOverrides()).rejects.toEqual(mockError.response.data);
    });
  });
});