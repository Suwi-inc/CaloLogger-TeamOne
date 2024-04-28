import { renderHook } from "@testing-library/react";
import useLogin from "../../hooks/useLogin";

// Mocking localStorage
const localStorageMock = (() => {
    let store: Record<string, string | null> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("useLogin Hook", () => {
    test("returns token from localStorage", () => {
        // Set up: Add token to localStorage
        localStorage.setItem("token", "fake-token");

        // Render the hook
        const { result } = renderHook(() => useLogin());

        // Assert
        expect(result.current).toBe("fake-token");
    });

    test("returns null if no token in localStorage", () => {
        localStorage.removeItem("token");

        // Render the hook
        const { result } = renderHook(() => useLogin());

        // Assert
        expect(result.current).toBeNull();
    });
});
