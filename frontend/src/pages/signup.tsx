import useLogin from "../hooks/useLogin";
import { Navigate } from "react-router-dom";
import { signUp as signUpRequest } from "../api/auth";
import { BACKEND_URL } from "../constants";
import useSWRMutation from "swr/mutation";

type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const token = useLogin();
  const { trigger, isMutating } = useSWRMutation(
    `${BACKEND_URL}/signup`,
    signUpRequest,
  );

  if (token) {
    return <Navigate to="/" />;
  }

  /**
   * Validates the form data.
   * @param data - The form data to be validated.
   * @returns True if the form data is valid, otherwise throws an error.
   * @throws {Error} If the passwords do not match, the password is less than 4 characters long,
   * or the username is less than 3 characters long.
   */
  const validateForm = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (data.password.length < 4) {
      throw new Error("Password must be at least 4 characters long");
    }

    if (data.username.length < 3) {
      throw new Error("Full name must be at least 3 characters long");
    }

    return true;
  };

  /**
   * Handles the form submission for the signup page.
   *
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const { username, password, confirmPassword } = Object.fromEntries(
      formData.entries(),
    ) as FormData;

    try {
      validateForm({ username, password, confirmPassword });
    } catch (error) {
      const errorMessage = (error as Error).message;
      alert(errorMessage);
      return;
    }

    try {
      await trigger({ username, password });
      window.location.href = "/login";
    } catch (error) {
      const errorMessage = (error as Error).message;
      alert(errorMessage);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="w-96 p-10 bg-white shadow-md rounded-md">
        <h1 className="text-4xl font-bold mb-1">Signup</h1>
        <p className="mb-4">Enter your details to create an account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="font-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-md mt-1"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-md mt-1"
              placeholder="********"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-md mt-1"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-2 mt-4 disabled:opacity-50"
            disabled={isMutating}
          >
            {isMutating ? "Signing up..." : "Sign up"}
          </button>
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
