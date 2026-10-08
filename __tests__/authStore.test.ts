import { describe, it, expect, beforeEach } from "vitest";
import useAuthStore from "../store/authStore";

describe("Enterprise AuthStore Test Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  it("should initialize unauthenticated by default", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("should securely store user, token, and role on login", () => {
    const testUser = {
      id: "std-999",
      name: "Tirunesh Dibaba",
      role: "STUDENT",
      grade: "Grade 12",
      stream: "Natural Science",
    };
    const testToken = "jwt.test.token.enterprise";

    useAuthStore.getState().login(testUser, "STUDENT", testToken);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe("Tirunesh Dibaba");
    expect(state.role).toBe("STUDENT");
    expect(state.token).toBe(testToken);

    // Verify localStorage persistence
    expect(localStorage.getItem("finkison_token")).toBe(testToken);
    expect(localStorage.getItem("finkison_role")).toBe("STUDENT");
  });

  it("should clear all persistent session tokens on logout", () => {
    useAuthStore.getState().login(
      { id: "std-1", name: "Kenenisa Bekele" },
      "STUDENT",
      "mock_token"
    );
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(localStorage.getItem("finkison_token")).toBeNull();
  });

  it("should update partial user profile fields cleanly", () => {
    useAuthStore.getState().login(
      { id: "std-1", name: "Derartu Tulu", xpPoints: 100 },
      "STUDENT",
      "mock_token"
    );

    useAuthStore.getState().updateUser({ xpPoints: 250, targetScore: 600 });

    const state = useAuthStore.getState();
    expect(state.user?.xpPoints).toBe(250);
    expect(state.user?.targetScore).toBe(600);
    expect(state.user?.name).toBe("Derartu Tulu");
  });
});
