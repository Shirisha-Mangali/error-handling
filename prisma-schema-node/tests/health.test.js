// tests/health.test.cjs
import request from "supertest";
import app from "../server.js";


describe("Health API", () => {
  it("should return OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
  });
});
