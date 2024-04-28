import { useEffect, useState } from "react";

/**
 * Custom hook for managing login functionality.
 * Retrieves the token from local storage and returns it.
 * @returns The token retrieved from local storage.
 */
const useLogin = () => {
    const [token, setToken] = useState<string | null>();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setToken(token);
    }, []);

    return token;
};

export default useLogin;
