import { Weight } from "../types";

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

export const getWeights = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${backendUrl}/weights`, {
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

export const addWeight = async (weight: number, date: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${backendUrl}/weights`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ weight, date }),
  });
  if (!response.ok) {
    throw new Error("Failed to add weight");
  }
  const data = await response.json();
  return data as Weight;
};
