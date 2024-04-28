import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../pages/login";

describe("Login Component", () => {
  beforeAll(() => {
    global.alert = vi.fn();
  });

  it("redirects to home page if already logged in", () => {
    // Mocking useLogin hook to return a token
    const useLoginMock = vi.fn().mockReturnValue("dummyToken");
    vi.mock("useLogin", () => useLoginMock);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    // Ensure redirection happens
    expect(window.location.pathname).toBe("/");
  });

  it("renders login form when user is not logged in", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    // Check if the login form is rendered
    expect(screen.getAllByText("Login")[0]).toBeInstanceOf(HTMLHeadingElement);

    // Check if username input field is present
    expect(screen.getByLabelText("Username")).toBeInTheDocument();

    // Check if password input field is present
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    // Check if the "Login" button is present
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();

    // Check if the "Don't have an account?" text is present
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();

    // Check if the "Sign up" link is present
    expect(screen.getByRole("link", { name: "Sign up" })).toBeInTheDocument();
  });

  //   it("displays error message for invalid login attempt", async () => {
  //     render(<Login />);

  //     // Fill out the form with invalid data
  //     fireEvent.change(screen.getByLabelText("Username"), {
  //       target: { value: "testUser" },
  //     });
  //     fireEvent.change(screen.getByLabelText("Password"), {
  //       target: { value: "invalidPassword" },
  //     });

  //     // Mocking the trigger function returned by useSWRMutation
  //     const mockTrigger = vi.fn().mockRejectedValue(new Error("Invalid credentials"));
  //     vi.fn(useSWRMutation).mockReturnValue({
  //       trigger: mockTrigger,
  //       isMutating: false,
  //     });

  //     // Submit the form
  //     fireEvent.click(screen.getByText("Login"));

  //     // Ensure error message is displayed
  //     expect(global.alert).toBeCalledWith("Invalid credentials");
  //   });

  //   it("submits form data and redirects to home page on successful login", async () => {
  //     render(<Login />);

  //     // Fill out the form with valid data
  //     fireEvent.change(screen.getByLabelText("Username"), {
  //       target: { value: "testUser" },
  //     });
  //     fireEvent.change(screen.getByLabelText("Password"), {
  //       target: { value: "validPassword" },
  //     });

  //     // Mocking the trigger function returned by useSWRMutation
  //     const mockTrigger = vi.fn().mockResolvedValue("dummyToken");
  //     vi.fn(useSWRMutation).mockReturnValue({
  //       trigger: mockTrigger,
  //       isMutating: false,
  //     });

  //     // Submit the form
  //     fireEvent.click(screen.getByText("Login"));

  //     // Ensure redirection happens after successful login
  //     expect(window.location.pathname).toBe("/");
  //   });
});
