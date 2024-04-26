import { useEffect, useState } from "react";

const useLogin = () => {
  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  return token;
};

export default useLogin;
