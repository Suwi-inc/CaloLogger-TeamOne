import useLogin from "../hooks/useLogin";
import { Navigate } from "react-router-dom";
import { signIn } from "../api/auth";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const token = useLogin();

  if (token) {
    return <Navigate to="/meals/" />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as FormData;
    try {
      await signIn(data.email, data.password);
      window.location.reload();
    } catch (error) {
      const errorMessage = (error as Error).message;
      alert(errorMessage);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="w-96 p-10 bg-white shadow-md rounded-md">
        <h1 className="text-4xl font-bold mb-1">Login</h1>
        <p className="mb-4">Enter your email and password to login.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-2 mt-4"
          >
            Login
          </button>
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
