import { render, screen, waitFor } from "@testing-library/react";
import AirQualityPanel from "./AirQualityPanel";

const originalEnv = process.env.REACT_APP_OPENWEATHER_API_KEY;

describe("AirQualityPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_OPENWEATHER_API_KEY = "test-key";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env.REACT_APP_OPENWEATHER_API_KEY = originalEnv;
  });

  it("shows loading state", () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}));

    render(<AirQualityPanel lat={49.28} lon={-123.12} />);

    expect(
      screen.getByText(/loading atmospheric pollutants/i)
    ).toBeInTheDocument();
  });

  it("renders nothing when lat or lon are missing", () => {
    render(<AirQualityPanel lat={null} lon={-123.12} />);

    expect(
      screen.queryByText(/air quality panel/i)
    ).not.toBeInTheDocument();
  });

  it("renders AQI and pollutant cards on success", async () => {
    fetch.mockResolvedValueOnce({
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

    render(<AirQualityPanel lat={49.28} lon={-123.12} />);

    await waitFor(() => {
      expect(screen.getByText(/aqi:\s*moderate/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/pm2_5/i)).toBeInTheDocument();
    expect(screen.getByText(/pm10/i)).toBeInTheDocument();
    expect(screen.getByText(/no2/i)).toBeInTheDocument();
    expect(screen.getByText(/o3/i)).toBeInTheDocument();
    expect(screen.getByText(/so2/i)).toBeInTheDocument();
    expect(screen.getByText(/^co$/i)).toBeInTheDocument();

    expect(screen.getAllByText(/12\.3/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/25\.4/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/18\.2/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/44\.1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/3\.7/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/201\.5/i).length).toBeGreaterThan(0);
  });

  it("renders Very Poor AQI correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        list: [
          {
            main: { aqi: 5 },
            components: {
              pm2_5: 50,
              pm10: 80,
              no2: 40,
              o3: 60,
              so2: 10,
              co: 300,
            },
          },
        ],
      }),
    });

    render(<AirQualityPanel lat={49.28} lon={-123.12} />);

    await waitFor(() => {
      expect(screen.getByText(/aqi:\s*very poor/i)).toBeInTheDocument();
    });
  });

  it("shows error when fetch fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<AirQualityPanel lat={49.28} lon={-123.12} />);

    await waitFor(() => {
      expect(
        screen.getByText(/failed to fetch air quality data/i)
      ).toBeInTheDocument();
    });
  });

  it("shows error when fetch throws", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<AirQualityPanel lat={49.28} lon={-123.12} />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});