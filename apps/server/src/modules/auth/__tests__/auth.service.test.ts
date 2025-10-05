import { setupTestDb } from "../../../tests/db-setup";
import { AuthService } from "../auth.service";
import { eq } from "drizzle-orm";

// we’ll mock signToken/verifyToken where needed
import * as common from "../../../utils/common";
import { users } from "../../users/schema/user.schema";

describe("AuthService (unit, in-memory DB)", () => {
  let authService: AuthService;
  let db: any;

  beforeEach(async () => {
    db = await setupTestDb();
    authService = new AuthService(db);
  });

  // -------------------------
  describe("signup", () => {
    it("signs up a new user", async () => {
      const result = await authService.signup({
        email: "unit1@example.com",
        password: "secret",
      });

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });

    it("prevents duplicate signups", async () => {
      await authService.signup({ email: "unit2@example.com", password: "secret" });

      await expect(
        authService.signup({ email: "unit2@example.com", password: "another" })
      ).rejects.toThrow(/already exists/i);
    });
  });

  // -------------------------
  describe("login", () => {
    it("logs in with correct credentials", async () => {
      await authService.signup({ email: "unit3@example.com", password: "secret" });

      const result = await authService.login({
        email: "unit3@example.com",
        password: "secret",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });

    it("rejects login with wrong password", async () => {
      await authService.signup({ email: "unit4@example.com", password: "secret" });

      await expect(
        authService.login({ email: "unit4@example.com", password: "wrong" })
      ).rejects.toThrow(/invalid/i);
    });

    it("rejects login for non-existent user", async () => {
      await expect(
        authService.login({ email: "nouser@example.com", password: "whatever" })
      ).rejects.toThrow(/invalid/i);
    });
  });

  // -------------------------
  describe("refresh", () => {
    it("refreshes access token with valid refresh token", async () => {
      const { refreshToken } = await authService.signup({
        email: "unit5@example.com",
        password: "secret",
      });

      const result = await authService.refresh(refreshToken);

      expect(result).toHaveProperty("accessToken");
      expect(result.refreshToken).toBe(refreshToken);
    });

    it("rejects refresh with missing token", async () => {
      await expect(authService.refresh("")).rejects.toThrow(/not found/i);
    });

    it("rejects refresh with invalid token", async () => {
      await expect(authService.refresh("invalid.token.here")).rejects.toThrow(/invalid/i);
    });

    it("rejects refresh if user no longer exists", async () => {
      const { refreshToken, id } = await authService.signup({
        email: "unit6@example.com",
        password: "secret",
      });

      await authService["db"].delete(users).where(eq(users.id, id));

      await expect(authService.refresh(refreshToken)).rejects.toThrow(/invalid/i);
    });
  });

  // -------------------------
  describe("forgotPassword", () => {
    it("generates reset token for existing user", async () => {
      const spy = jest.spyOn(common, "signToken");

      await authService.signup({ email: "unit7@example.com", password: "secret" });
      await authService.forgotPassword("unit7@example.com");

      expect(spy).toHaveBeenCalledWith({id: expect.any(Number), email:"unit7@example.com", role: "user"}, "5m");
    });

    it("does nothing if user does not exist", async () => {
      const result = await authService.forgotPassword("unknown@example.com");
      expect(result).toBeUndefined();
    });
  });

  // -------------------------
  describe("resetPassword", () => {
    it("resets password with valid token", async () => {
      const { id } = await authService.signup({
        email: "unit8@example.com",
        password: "secret",
      });

      const resetToken = common.signToken({id, email: "unit8@example.com"}, "5m");

      const updated = await authService.resetPassword({
        token: resetToken,
        newPassword: "newSecret",
      });

      expect(updated[0].password).not.toBe("secret");
    });

    it("rejects reset with invalid token", async () => {
      await expect(
        authService.resetPassword({ token: "invalid.token.here", newPassword: "whatever" })
      ).rejects.toThrow(/invalid/i);
    });
  });
});
