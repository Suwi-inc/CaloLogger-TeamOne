import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import Container from "./container";
import Logout from "./Logout";

/**
 * Represents a navigation item in the header.
 * @param name - The name of the navigation item.
 * @param path - The path to navigate to when the item is clicked.
 */
const NavItem = ({ name, path }: { name: string; path: string }) => (
    <li className="text-gray-600 hover:text-black transition duration-200">
        <Link to={path}>{name}</Link>
    </li>
);

/**
 * Renders a navigation list component.
 * @returns The rendered navigation list component.
 */
const NavList = () => {
    const list = [
        { name: "Dashboard", path: "/" },
        { name: "Meal Tracking", path: "/meal-tracking" },
        { name: "Weight Tracking", path: "/weight-tracking" },
    ];

    return (
        <ul className="flex space-x-6 items-center">
            {list.map((item, index) => (
                <NavItem key={index} name={item.name} path={item.path} />
            ))}
            <Logout />
        </ul>
    );
};

/**
 * Renders the header component.
 * @returns The header component.
 */
const Header = () => {
    const token = useLogin();

    if (!token) return <></>;
    return (
        <header className="w-full bg-gray-100">
            <Container>
                <div className="flex justify-between items-center py-3">
                    <h1 className="text-lg font-semibold">Health Tracker</h1>
                    <NavList />
                </div>
            </Container>
        </header>
    );
};

export { NavItem, NavList };
export default Header;
