import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import Container from "./container";

const NavItem = ({ name, path }: { name: string; path: string }) => (
  <li className="text-gray-600 hover:text-black transition duration-200">
    <Link to={path}>{name}</Link>
  </li>
);

const NavList = () => {
  const list = [
    { name: "Dashboard", path: "/" },
    { name: "Meal Tracking", path: "/meal-tracking" },
    { name: "Weight Tracking", path: "/weight-tracking" },
  ];

  return (
    <ul className="flex space-x-6 ">
      {list.map((item, index) => (
        <NavItem key={index} name={item.name} path={item.path} />
      ))}
    </ul>
  );
};

const Header = () => {
  const token = useLogin();

  if (!token) return <></>;
  return (
    <header className="w-full px-3 bg-gray-100">
      <Container>
        <div className="flex justify-between items-center py-3">
          <h1 className="text-lg font-semibold">Health Tracker</h1>
          <NavList />
        </div>
      </Container>
    </header>
  );
};

export default Header;
