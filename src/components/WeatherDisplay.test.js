import { render, screen } from "@testing-library/react";
import WeatherDisplay from "./WeatherDisplay";

describe("WeatherDisplay", () => {
  const mockData = {
    name: "Vancouver",
    main: {
      temp: 18,
      humidity: 70,
    },
    wind: {
      speed: 3,
    },
    weather: [
      {
        description: "clear sky",
        icon: "01d",
      },
    ],
  };

  it("renders all weather data correctly", () => {
    render(<WeatherDisplay data={mockData} />);

    expect(screen.getByText(/vancouver/i)).toBeInTheDocument();
    expect(screen.getByText(/temperature: 18/i)).toBeInTheDocument();
    expect(screen.getByText(/humidity: 70/i)).toBeInTheDocument();
    expect(screen.getByText(/wind speed: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/conditions: clear sky/i)).toBeInTheDocument();
  });

  it("renders the weather icon with correct src", () => {
    render(<WeatherDisplay data={mockData} />);

    const img = screen.getByAltText(/weather icon/i);

    expect(img).toBeInTheDocument();
    expect(img.src).toContain("01d@2x.png");
  });
});