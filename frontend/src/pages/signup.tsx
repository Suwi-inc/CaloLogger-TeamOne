import useLogin from "../hooks/useLogin";
import { Navigate } from "react-router-dom";
import { signUp as signUpRequest } from "../api/auth";

type FormData = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const token = useLogin();

  if (token) {
    return <Navigate to="/meals/" />;
  }

  const validateForm = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (data.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    if (data.fullname.length < 3) {
      throw new Error("Full name must be at least 3 characters long");
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as FormData;

    try {
      validateForm(data);
    } catch (error) {
      const errorMessage = (error as Error).message;
      alert(errorMessage);
      return;
    }

    try {
      await signUpRequest(data.email, data.password, data.fullname);
      window.location.reload();
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
            <label htmlFor="fullname" className="font-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-md mt-1"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-md mt-1"
              placeholder="name@company.com"
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
            className="w-full bg-blue-500 text-white rounded-md py-2 mt-4"
          >
            Sign Up
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
