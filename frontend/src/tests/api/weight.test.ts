import { vi } from "vitest";
import { addWeight, deleteWeight, getWeights } from "../../api/weight";
import { Weight } from "../../types";
import { MOCK_WEIGHT_RESPONSE } from "../constants";

describe("Weights API Functions", () => {
  const token = "dummyToken";
  const localStorageMock = {
    getItem: vi.fn(),
  };

  beforeAll(() => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
  });

  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(token);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getWeights Function", () => {
    it("returns weights on successful fetch", async () => {
      const url = "https://example.com/weights";

      // Mocking fetch to return a successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => MOCK_WEIGHT_RESPONSE,
      });

      const weights = await getWeights(url);
      expect(weights).toEqual(MOCK_WEIGHT_RESPONSE);
    });

    it("throws an error on failed fetch", async () => {
      const url = "https://example.com/weights";

      // Mocking fetch to return an error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(getWeights(url)).rejects.toThrow("Failed to fetch weights");
    });
  });

  describe("addWeight Function", () => {
    it("returns added weight on successful addition", async () => {
      const mockAddWeightRequestArgs = {
        weight: 10,
        date: new Date().toISOString(),
      };
      const mockAddedWeight: Weight = {
        id: 0,
        weight: 10,
        date: new Date().toISOString(),
        user_id: 0,
      };
      const url = "https://example.com/weights";

      // Mocking fetch to return a successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockAddedWeight,
      });

      const addedWeight = await addWeight(url, {
        arg: mockAddWeightRequestArgs,
      });
      expect(addedWeight).toEqual(mockAddedWeight);
    });

    it("throws an error on failed addition", async () => {
      const mockAddWeightRequestArgs = {
        weight: 10,
        date: new Date().toISOString(),
      };
      const url = "https://example.com/weights";

      // Mocking fetch to return an error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(
        addWeight(url, { arg: mockAddWeightRequestArgs }),
      ).rejects.toThrow("Failed to add weight");
    });
  });

  describe("deleteWeight Function", () => {
    it("returns true on successful deletion", async () => {
      const url = "https://example.com/weights/1";

      // Mocking fetch to return a successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
      });

      const result = await deleteWeight(url);
      expect(result).toBe(true);
    });

    it("throws an error on failed deletion", async () => {
      const url = "https://example.com/weights/1";

      // Mocking fetch to return an error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(deleteWeight(url)).rejects.toThrow(
        "Failed to delete weight",
      );
    });
  });
});
