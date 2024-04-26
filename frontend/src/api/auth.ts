const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

export const signIn = async (email: string, password: string) => {
  const response = await fetch(`${backendUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await response.json();
  return data.token;
};

export const signUp = async (
  email: string,
  password: string,
  fullname: string
) => {
  const response = await fetch(`${backendUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, fullname }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return true;
};
