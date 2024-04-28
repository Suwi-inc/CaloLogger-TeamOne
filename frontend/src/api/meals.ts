import { SearchResult, Meal, CreateMeal } from "../types";

/**
 * Performs a search for meals based on the provided query.
 * @param url - The URL to send the search request to.
 * @param arg - An object containing the query string.
 * @param arg.query - The search query string.
 * @returns A promise that resolves to an array of search results.
 * @throws An error if the search request fails.
 */
export const search = async (
  url: string,
  { arg }: { arg: { query: string } }
) => {
  const token = localStorage.getItem("token");
  const fullURL = new URL(url);
  fullURL.searchParams.append("query", arg.query);

  const response = await fetch(fullURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to search meals");
  }

  const data = await response.json();
  return data as SearchResult[];
};

/**
 * Fetches meals from the specified URL.
 * @param url - The URL to fetch meals from.
 * @returns A promise that resolves to an array of Meal objects.
 * @throws An error if the request fails.
 */
export const getMeals = async (url: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch meals");
  }
  const data = await response.json();
  return data as Meal[];
};

/**
 * Adds a new meal to the server.
 * @param url - The URL of the server endpoint.
 * @param arg - The meal data to be added.
 * @returns A promise that resolves to the added meal.
 * @throws An error if the request fails.
 */
export const addMeal = async (url: string, { arg }: { arg: CreateMeal }) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  if (!response.ok) {
    throw new Error("Failed to add meal");
  }
  const data = await response.json();
  return data as Meal;
};

/**
 * Deletes a meal from the server.
 * @param url - The URL of the meal to delete.
 * @returns A boolean indicating whether the meal was successfully deleted.
 * @throws An error if the deletion fails.
 */
export const deleteMeal = async (url: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete meal");
  }
  return true;
};
