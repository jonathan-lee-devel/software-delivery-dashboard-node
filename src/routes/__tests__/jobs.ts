import request from "supertest";
import { app } from "../../app";

describe("GET /jobs", () => {
  it("Returns status 200", async () => {
    const res = await request(app).get("/jobs");

    expect(res.statusCode).toEqual(200);
  });
});
