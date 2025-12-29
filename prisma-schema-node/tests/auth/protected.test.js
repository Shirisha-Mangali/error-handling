
//tests/auth/protected.test.js
import request from "supertest";
import app from "../../app.js";
import { generateTestToken } from "../helpers/token.js";

describe("Protected routes", () => {
  it("should allow access with valid JWT", async () => {
    const user = {
      id: 1,
      role: "doctor",
      email: "test@doctor.com",
    };

    const token = generateTestToken(user);

    const res = await request(app)
      .get("/doctors")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).not.toBe(401);
  });

  it("should block access without token", async () => {
    const res = await request(app).get("/doctors");
    expect(res.status).toBe(401);
  });
});
