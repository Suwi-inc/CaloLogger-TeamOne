import { vi } from "vitest";
import { addMeal, deleteMeal, getMeals, search } from "../../api/meals";
import { CreateMeal, Meal, SearchResult } from "../../types";
import { MOCK_MEALS_RESPONSE } from "../constants";

describe("Meals API Functions", () => {
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

  describe("search Function", () => {
    it("returns search results on successful search", async () => {
      const mockSearchResponse: SearchResult[] = [
        { title: "testTitle", ingredients: "testIngredients" },
      ];
      const query = "testQuery";
      const url = "https://example.com/search";

      // Mocking fetch to return a successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResponse,
      });

      const searchResult = await search(url, { arg: { query } });
      expect(searchResult).toEqual(mockSearchResponse);
    });

    it("throws an error on failed search", async () => {
      const query = "testQuery";
      const url = "https://example.com/search";

      // Mocking fetch to return an error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(search(url, { arg: { query } })).rejects.toThrow(
        "Failed to search meals",
      );
    });
  });

  describe("getMeals Function", () => {
    it("returns meals on successful fetch", async () => {
      const url = "https://example.com/meals";

      // Mocking fetch to return a successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => MOCK_MEALS_RESPONSE,
      });

      const meals = await getMeals(url);
      expect(meals).toEqual(MOCK_MEALS_RESPONSE);
    });

    it("throws an error on failed fetch", async () => {
      const url = "https://example.com/meals";

      // Mocking fetch to return an error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(getMeals(url)).rejects.toThrow("Failed to fetch meals");
    });
  });

  describe("addMeal Function", () => {
    it("returns added meal on successful addition", async () => {
      const mockCreateMeal: CreateMeal = {
        name: "testName",
        ingredients: "testIngredients",
        date: new Date().toISOString(),
      };
      const mockAddedMeal: Meal = MOCK_MEALS_RESPONSE[0];
      const url = "https://example.com/meals";

      // Mocking fetch to return a successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockAddedMeal,
      });

      const addedMeal = await addMeal(url, { arg: mockCreateMeal });
      expect(addedMeal).toEqual(mockAddedMeal);
    });

    it("throws an error on failed addition", async () => {
      const mockCreateMeal: CreateMeal = {
        name: "testName",
        ingredients: "testIngredients",
        date: new Date().toISOString(),
      };
      const url = "https://example.com/meals";

      // Mocking fetch to return an error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(addMeal(url, { arg: mockCreateMeal })).rejects.toThrow(
        "Failed to add meal",
      );
    });
  });

  describe("deleteMeal Function", () => {
    it("returns true on successful deletion", async () => {
      const url = "https://example.com/meals/1";

      // Mocking fetch to return a successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
      });

      const result = await deleteMeal(url);
      expect(result).toBe(true);
    });

    it("throws an error on failed deletion", async () => {
      const url = "https://example.com/meals/1";

      // Mocking fetch to return an error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(deleteMeal(url)).rejects.toThrow("Failed to delete meal");
    });
  });
});
