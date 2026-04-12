import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import axios from "axios";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

global.fetch = jest.fn();

describe("App integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lets the user enter a location and see weather in the real app", async () => {
    axios.get
      .mockResolvedValueOnce({
        data: {
          name: "Vancouver",
          sys: { country: "CA" },
          coord: { lat: 49.28, lon: -123.12 },
          main: {
            temp: 18,
            feels_like: 17,
            humidity: 70,
            pressure: 1012,
          },
          wind: {
            speed: 3,
          },
          weather: [
            {
              main: "Clear",
              description: "clear sky",
              icon: "01d",
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          list: [
            {
              components: { co: 3000 },
            },
          ],
        },
      });

    global.fetch.mockImplementation((url) => {
      if (String(url).includes("/api/global-co2")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            co2: 420,
            date: "2026-04-11",
            change: 1.23,
            trend: "rising",
            source: "NOAA",
          }),
        });
      }

      if (String(url).includes("air_pollution")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            list: [
              {
                main: { aqi: 3 },
                components: {
                  pm2_5: 12.3,
                  pm10: 25.4,
                  no2: 18.2,
                  o3: 44.1,
                  so2: 3.7,
                  co: 201.5,
                },
              },
            ],
          }),
        });
      }

      return Promise.reject(new Error(`Unhandled fetch URL: ${url}`));
    });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/enter city/i), {
      target: { value: "Vancouver" },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter country code/i), {
      target: { value: "CA" },
    });

    fireEvent.click(screen.getByRole("button", { name: /get weather/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/vancouver/i).length).toBeGreaterThan(0);
    });

    expect(screen.getByText(/temperature:\s*18/i)).toBeInTheDocument();
    expect(screen.getByText(/humidity:\s*70/i)).toBeInTheDocument();
expect(screen.getByText(/wind speed:\s*3/i)).toBeInTheDocument();
expect(screen.getByText(/conditions:\s*clear sky/i)).toBeInTheDocument();

    expect(screen.getByText(/atmospheric snapshot/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/global co₂/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/air quality panel/i)).toBeInTheDocument();
    });
  });
});