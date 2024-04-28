import { Navigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import Loading from "./loading";

/**
 * A protected route component that checks if the user is logged in.
 * If the user is logged in, it renders the children components.
 * If the user is not logged in, it redirects to the login page.
 *
 * @param children - The child components to render if the user is logged in.
 * @returns The protected route component.
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = useLogin();
  if (isLoggedIn === undefined) return <Loading />;
  return isLoggedIn ? children : <Navigate replace to="/login" />;
};

export default ProtectedRoute;
