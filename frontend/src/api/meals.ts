import { SearchResult, Meal, CreateMeal } from "../types";

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
