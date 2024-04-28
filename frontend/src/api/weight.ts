import { Weight } from "../types";

export interface AddWeightRequestArgs {
  weight: number;
  date: string;
}

/**
 * Retrieves weights from the specified URL.
 * @param url - The URL to fetch the weights from.
 * @returns A promise that resolves to an array of Weight objects.
 * @throws An error if the request fails.
 */
export const getWeights = async (url: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch weights");
  }
  const data = await response.json();
  return data as Weight[];
};

/**
 * Adds weight data to the server.
 * @param url - The URL of the server endpoint.
 * @param arg - The weight data to be added.
 * @returns A promise that resolves to the added weight data.
 * @throws An error if the request fails.
 */
export const addWeight = async (
  url: string,
  { arg }: { arg: AddWeightRequestArgs },
) => {
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
    throw new Error("Failed to add weight");
  }
  const data = await response.json();
  return data as Weight;
};

/**
 * Deletes a weight entry from the server.
 * @param url - The URL of the weight entry to delete.
 * @returns A boolean indicating whether the weight entry was successfully deleted.
 * @throws An error if the deletion fails.
 */
export const deleteWeight = async (url: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete weight");
  }
  return true;
};
