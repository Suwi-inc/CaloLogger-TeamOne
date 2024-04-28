export type FormData = {
  username: string;
  password: string;
};

/**
 * Sends a sign-in request to the specified URL with the provided arguments.
 * @param url - The URL to send the sign-in request to.
 * @param arg - The arguments for the sign-in request.
 * @returns The access token received from the server.
 * @throws Error if the sign-in request fails or the credentials are invalid.
 */
export const signIn = async (url: string, { arg }: { arg: FormData }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await response.json();
  return data.access_token as string;
};

/**
 * Sends a sign-up request to the specified URL with the provided data.
 * @param url - The URL to send the sign-up request to.
 * @param arg - The data to include in the sign-up request.
 * @returns A Promise that resolves to a boolean indicating the success of the sign-up request.
 * @throws An error with the message "Invalid credentials" if the sign-up request fails.
 */
export const signUp = async (url: string, { arg }: { arg: FormData }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return true;
};
