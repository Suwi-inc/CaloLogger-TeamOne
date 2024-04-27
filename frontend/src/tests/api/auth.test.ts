import { vi } from "vitest";
import { signIn, signUp } from "../../api/auth";

describe("signIn Function", () => {
  const validFormData = {
    username: "testUser",
    password: "validPassword",
  };

  const invalidFormData = {
    username: "testUser",
    password: "invalidPassword",
  };

  it("returns access token on successful login", async () => {
    // Mocking fetch to return a successful response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "dummyToken" }),
    });

    const accessToken = await signIn("/login", { arg: validFormData });
    expect(accessToken).toBe("dummyToken");
  });

  it("throws error on invalid credentials", async () => {
    // Mocking fetch to return an error response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });

    await expect(signIn("/login", { arg: invalidFormData })).rejects.toThrow("Invalid credentials");
  });
});

describe("signUp Function", () => {
  const validFormData = {
    username: "testUser",
    password: "validPassword",
  };

  const invalidFormData = {
    username: "testUser",
    password: "invalidPassword",
  };

  it("returns true on successful signup", async () => {
    // Mocking fetch to return a successful response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
    });

    const result = await signUp("/signup", { arg: validFormData });
    expect(result).toBe(true);
  });

  it("throws error on invalid credentials", async () => {
    // Mocking fetch to return an error response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });

    await expect(signUp("/signup", { arg: invalidFormData })).rejects.toThrow("Invalid credentials");
  });
});
