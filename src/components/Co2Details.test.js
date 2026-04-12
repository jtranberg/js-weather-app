import { render, screen, waitFor } from "@testing-library/react";
import Co2Details from "./Co2Details";

// 🔥 mock fetch (IMPORTANT: you are using fetch, not axios)
global.fetch = jest.fn();

describe("Co2Details", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

 it("shows loading state", () => {
  fetch.mockImplementationOnce(() => new Promise(() => {}));

  render(<Co2Details />);

  expect(
    screen.getByText(/loading global co₂ data/i)
  ).toBeInTheDocument();
});

  it("renders CO2 data correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        co2: 420,
        date: "2026-04-12",
        change: 1.23,
        trend: "rising",
        source: "NOAA",
      }),
    });

    render(<Co2Details />);

    await waitFor(() => {
      expect(screen.getByText(/420\.00/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/ppm/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/rising/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1\.23/i)).toBeInTheDocument();
    expect(screen.getByText(/noaa/i)).toBeInTheDocument();
  });

  it("renders correct CO2 level (moderate)", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        co2: 430,
      }),
    });

    render(<Co2Details />);

    await waitFor(() => {
      expect(screen.getByText(/430\.00/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/elevated/i).length).toBeGreaterThan(0);
  });

  it("renders correct CO2 level (high)", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        co2: 450,
      }),
    });

    render(<Co2Details />);

    await waitFor(() => {
      expect(screen.getByText(/450\.00/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/modern high/i)).toBeInTheDocument();
  });

  it("shows error when API fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Co2Details />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load co₂/i)).toBeInTheDocument();
    });
  });

  it("shows error when fetch throws", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<Co2Details />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});