import { Weight } from "../types";

export interface AddWeightRequestArgs {
  weight: number;
  date: string;
}

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

export const addWeight = async (
  url: string,
  { arg }: { arg: AddWeightRequestArgs }
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
