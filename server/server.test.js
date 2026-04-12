import request from "supertest";
import { jest } from "@jest/globals";

const mockFetch = jest.fn();

jest.unstable_mockModule("node-fetch", () => ({
  default: mockFetch,
}));

const { app, resetCache } = await import("./server.js");

describe("CO2 API server", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetCache();
  });

  it("returns service health on GET /", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "ok",
      service: "be-brave-to-breath-co2-api",
    });
  });

  it("returns parsed CO2 data from NOAA CSV", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => `
# comment
2026,04,10,0,424.12
2026,04,11,0,425.55
      `,
    });

    const res = await request(app).get("/api/global-co2");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      co2: 425.55,
      change: 1.43,
      date: "2026-04-11",
      trend: "rising",
      source: "NOAA Mauna Loa",
    });
  });

  it("uses cache on repeated requests", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => `
# comment
2026,04,10,0,424.12
2026,04,11,0,425.55
      `,
    });

    const first = await request(app).get("/api/global-co2");
    const second = await request(app).get("/api/global-co2");

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when NOAA request fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const res = await request(app).get("/api/global-co2");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Failed to fetch CO₂ data",
      detail: "NOAA request failed: 500",
    });
  });

  it("returns 500 when CSV data is invalid", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => `
# comment
2026,04,10,0,424.12
2026,04,11,0,not-a-number
      `,
    });

    const res = await request(app).get("/api/global-co2");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Failed to fetch CO₂ data",
      detail: "Invalid CO₂ value",
    });
  });
});