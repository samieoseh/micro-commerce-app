import request from "supertest";
import app from "../../../app";
import { setupTestDb } from "../../../tests/db-setup";
import { authService } from "../auth.service";
import * as common from "../../../utils/common";

beforeEach(async () => {
  const testDb = await setupTestDb();
  (authService as any).db = testDb;
});

describe("Auth API Integration", () => {
  // -------------------------
  describe("signup", () => {
    it("signs up a user via API", async () => {
      const res = await request(app)
        .post("/api/v1/auth/signup")
        .send({ email: "test@example.com", password: "Password@123" });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("accessToken");
    });

    it("prevents duplicate signups via API", async () => {
      await request(app)
        .post("/api/v1/auth/signup")
        .send({ email: "test2@example.com", password: "Password@123" });

      const res = await request(app)
        .post("/api/v1/auth/signup")
        .send({ email: "test2@example.com", password: "Password@123" });

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/already exists/i);
    });
  });

  // -------------------------
  describe("login", () => {
    it("logs in via API", async () => {
      await request(app)
        .post("/api/v1/auth/signup")
        .send({ email: "test3@example.com", password: "Password@123" });

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test3@example.com", password: "Password@123" });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("accessToken");
    });

    it("rejects login with wrong password via API", async () => {
      await request(app)
        .post("/api/v1/auth/signup")
        .send({ email: "test4@example.com", password: "Password@123" });

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test4@example.com", password: "Password123!" });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });
  });

  // -------------------------
  describe("refresh", () => {
    it("returns new access token with valid refresh token", async () => {
      const signup = await request(app)
        .post("/api/v1/auth/signup")
        .send({ email: "test5@example.com", password: "Password@123" });

      const refreshToken = signup.body.data.refreshToken;

      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data.refreshToken).toBe(refreshToken);
    });

    it("rejects refresh with missing token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "" });

      expect(res.status).toBe(400);
    });

    it("rejects refresh with invalid token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "invalid-token-here" });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });
  });

  // -------------------------
  describe("forgot-password", () => {
    it("returns 200 even if user does not exist", async () => {
      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "nouser@example.com" });

      // API usually hides whether user exists
      expect([200, 204]).toContain(res.status);
    });

    it("triggers reset token creation for existing user", async () => {
      jest.spyOn(common, "signToken");
      await request(app)
        .post("/api/v1/auth/signup")
        .send({ email: "test6@example.com", password: "Password@123" });

      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "test6@example.com" });

      expect([200, 204]).toContain(res.status);
      expect(common.signToken).toHaveBeenCalledWith(
        expect.any(Number),
        "test6@example.com",
        "5m"
      );
    });
  });

  // -------------------------
  describe("reset-password", () => {
    it("resets password with valid token", async () => {
      const signup = await request(app)
        .post("/api/v1/auth/signup")
        .send({ email: "test7@example.com", password: "Password@123" });

      const resetToken = common.signToken(
        signup.body.data.id,
        "test7@example.com",
        "5m"
      );

      const res = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({ token: resetToken, newPassword: "NewPassword@123" });

      expect(res.status).toBe(200);
    });

    it("rejects reset with invalid token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({ token: "invalid-token-here", newPassword: "Password@123" });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });
  });
});
