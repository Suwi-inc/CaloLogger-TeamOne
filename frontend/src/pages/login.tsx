import useLogin from "../hooks/useLogin";
import { Navigate } from "react-router-dom";
import { signIn } from "../api/auth";
import { BACKEND_URL } from "../constants";
import useSWRMutation from "swr/mutation";
import type { FormData } from "../api/auth";

const Login = () => {
    const token = useLogin();

    const { trigger, isMutating } = useSWRMutation(
        `${BACKEND_URL}/login`,
        signIn
    );

    if (token) {
        return <Navigate to="/" />;
    }

    /**
     * Handles the form submission event.
     *
     * @param e - The form submission event.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const { username, password } = Object.fromEntries(
            formData.entries()
        ) as FormData;

        try {
            const token = await trigger({ username, password });
            localStorage.setItem("token", token);
            window.location.href = "/dashboard";
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
                    <button
                        id="login-button"
                        type="submit"
                        className="w-full bg-blue-500 text-white rounded-md py-2 mt-4 disabled:opacity-50"
                        disabled={isMutating}
                    >
                        {isMutating ? "Logging in..." : "Login"}
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
