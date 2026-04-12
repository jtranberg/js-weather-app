import { render, screen } from "@testing-library/react";
import ForecastDisplay from "./ForecastDisplay";

describe("ForecastDisplay", () => {
  const mockData = {
    list: [
      {
        dt_txt: "2026-04-12 12:00:00",
        main: { temp: 18 },
        weather: [{ description: "clear sky" }],
      },
      {
        dt_txt: "2026-04-12 15:00:00",
        main: { temp: 19 },
        weather: [{ description: "cloudy" }],
      },
      {
        dt_txt: "2026-04-12 18:00:00",
        main: { temp: 17 },
        weather: [{ description: "rain" }],
      },
      {
        dt_txt: "2026-04-12 21:00:00",
        main: { temp: 16 },
        weather: [{ description: "storm" }],
      },
      {
        dt_txt: "2026-04-13 00:00:00",
        main: { temp: 15 },
        weather: [{ description: "fog" }],
      },
      {
        dt_txt: "2026-04-13 03:00:00",
        main: { temp: 14 },
        weather: [{ description: "snow" }],
      },
    ],
  };

  it("renders the Forecast title", () => {
    render(<ForecastDisplay data={mockData} />);
    expect(screen.getByText(/forecast/i)).toBeInTheDocument();
  });

  it("renders only the first 5 forecast items", () => {
    render(<ForecastDisplay data={mockData} />);

    const temps = screen.getAllByText(/temperature:/i);
    expect(temps.length).toBe(5); // slice(0,5)
  });

  it("renders temperatures correctly", () => {
    render(<ForecastDisplay data={mockData} />);

    expect(screen.getByText(/temperature: 18/i)).toBeInTheDocument();
    expect(screen.getByText(/temperature: 19/i)).toBeInTheDocument();
  });

  it("renders weather conditions", () => {
    render(<ForecastDisplay data={mockData} />);

    expect(screen.getByText(/conditions: clear sky/i)).toBeInTheDocument();
    expect(screen.getByText(/conditions: cloudy/i)).toBeInTheDocument();
  });

  it("formats and displays dates using moment", () => {
  render(<ForecastDisplay data={mockData} />);

  const dates = screen.getAllByText(/2026/i);
  expect(dates.length).toBe(5);
});
});