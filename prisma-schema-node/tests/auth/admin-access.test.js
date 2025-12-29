
//tests/auth/admin-access.test.js
import request from "supertest";
import app from "../../app.js";          // your express app
import { generateTestToken } from "../helpers/token.js";

describe("Admin route authorization", () => {
  it("should block patient from admin routes", async () => {
    const token = generateTestToken({
      id: 2,
      role: "patient",
      email: "p@test.com",
    });

    const res = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});
