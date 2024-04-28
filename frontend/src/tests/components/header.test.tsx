import { screen, render, within } from "@testing-library/react";
import { NavItem, NavList } from "../../components/header";
import { BrowserRouter } from "react-router-dom";

describe("NavItem", () => {
    it("renders a link with the correct name", () => {
        const name = "Home";
        const path = "/";
        const { getByText } = render(
            <BrowserRouter>
                <NavItem name={name} path={path} />
            </BrowserRouter>
        );
        expect(getByText(name)).toBeInTheDocument();
    });
});

it("renders a link with the correct path", () => {
    const name = "About";
    const path = "/about";
    const { getByText } = render(
        <BrowserRouter>
            <NavItem name={name} path={path} />
        </BrowserRouter>
    );
    expect(getByText(name)).toHaveAttribute("href", path);
});

describe("NavList", () => {
    it("renders a list of navigation items", () => {
        const { getByText } = render(
            <BrowserRouter>
                <NavList />
            </BrowserRouter>
        );
        expect(getByText("Dashboard")).toBeInTheDocument();
        expect(getByText("Meal Tracking")).toBeInTheDocument();
        expect(getByText("Weight Tracking")).toBeInTheDocument();
    });

    it("renders the correct number of items", () => {
        render(
            <BrowserRouter>
                <NavList />
            </BrowserRouter>
        );
        const list = screen.getByRole("list");
        const { getAllByRole } = within(list);
        const items = getAllByRole("listitem");
        expect(items.length).toBe(3);
    });
});
