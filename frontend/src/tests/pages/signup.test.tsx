import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUp from "../../pages/signup";

describe("SignUp Component", () => {
  beforeAll(() => {
    global.alert = vi.fn();
  });

  it("redirects to home page if already logged in", () => {
    // Mocking useLogin hook to return a token
    const useLoginMock = vi.fn().mockReturnValue("dummyToken");
    vi.mock("../hooks/useLogin", () => useLoginMock);

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Ensure redirection happens
    expect(window.location.pathname).toBe("/");
  });

  it("displays error message for password mismatch", async () => {
    render(<SignUp />);

    // Fill out the form with incorrect password confirmation
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "differentPassword" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Sign up"));

    expect(global.alert).toBeCalledWith("Passwords do not match");
  });

  it("displays error message for short password", async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "abc" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Sign up"));

    // Ensure error message is displayed
    expect(global.alert).toBeCalledWith(
      "Password must be at least 4 characters long"
    );
  });

  it("displays error message for short username", async () => {
    render(<SignUp />);

    // Fill out the form with short username
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "ab" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Sign up"));

    // Ensure error message is displayed
    expect(global.alert).toBeCalledWith(
      "Full name must be at least 3 characters long"
    );
  });

//   it("submits form data and redirects to login page on successful signup", async () => {
//     render(<SignUp />);

//     // Fill out the form with valid data
//     fireEvent.change(screen.getByLabelText("Username"), {
//       target: { value: "testUser" },
//     });
//     fireEvent.change(screen.getByLabelText("Password"), {
//       target: { value: "password" },
//     });
//     fireEvent.change(screen.getByLabelText("Confirm Password"), {
//       target: { value: "password" },
//     });

//     // Mocking the trigger function returned by useSWRMutation
//     global.fetc = vi.fn().mockResolvedValue({ ok: true });

//     // Submit the form
//     fireEvent.click(screen.getByText("Sign up"));

//     // Ensure redirection happens after successful signup
//     console.log(window.location.pathname);
//     expect(global.alert).toBeCalledWith("hi");
//   });
});
