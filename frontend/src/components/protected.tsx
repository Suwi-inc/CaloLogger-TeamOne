import { Navigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import Loading from "./loading";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = useLogin();
  if (isLoggedIn === undefined) return <Loading />;
  return isLoggedIn ? children : <Navigate replace to="/login" />;
};

export default ProtectedRoute;
