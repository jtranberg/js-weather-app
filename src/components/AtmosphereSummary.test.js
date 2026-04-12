import { render, screen } from "@testing-library/react";
import AtmosphereSummary from "./AtmosphereSummary";

describe("AtmosphereSummary", () => {
  const baseWeatherData = {
    name: "Vancouver",
    sys: { country: "CA" },
    main: {
      temp: 22,
      feels_like: 24,
      humidity: 65,
      pressure: 1013,
    },
    wind: {
      speed: 5,
    },
    weather: [
      {
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
  };

  it("renders nothing when weatherData is missing", () => {
    render(<AtmosphereSummary />);

expect(
  screen.queryByText(/atmospheric snapshot/i)
).not.toBeInTheDocument();
  });

  it("renders location and condition details", () => {
    render(<AtmosphereSummary weatherData={baseWeatherData} />);

    expect(screen.getByText(/vancouver, ca/i)).toBeInTheDocument();
    expect(screen.getByText(/clear • clear sky/i)).toBeInTheDocument();
  });

  it("renders temperature and feels like values", () => {
    render(<AtmosphereSummary weatherData={baseWeatherData} />);

    expect(screen.getByText(/22°c/i)).toBeInTheDocument();
    expect(screen.getByText(/feels like 24°c/i)).toBeInTheDocument();
  });

  it("renders the default stable summary", () => {
    render(<AtmosphereSummary weatherData={baseWeatherData} />);

    expect(screen.getAllByText(/stable/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        /atmospheric conditions currently appear stable for most normal outdoor activity/i
      )
    ).toBeInTheDocument();
  });

  it("renders metric pills", () => {
    render(<AtmosphereSummary weatherData={baseWeatherData} />);

    expect(screen.getByText(/humidity/i)).toBeInTheDocument();
    expect(screen.getByText(/65%/i)).toBeInTheDocument();

    expect(screen.getByText(/wind/i)).toBeInTheDocument();
    expect(screen.getByText(/5 m\/s/i)).toBeInTheDocument();

    expect(screen.getByText(/pressure/i)).toBeInTheDocument();
    expect(screen.getByText(/1013 hpa/i)).toBeInTheDocument();

    expect(screen.getByText(/cycle/i)).toBeInTheDocument();
    expect(screen.getByText(/day conditions/i)).toBeInTheDocument();
  });

  it("shows night conditions when icon includes n", () => {
    const weatherData = {
      ...baseWeatherData,
      weather: [
        {
          ...baseWeatherData.weather[0],
          icon: "01n",
        },
      ],
    };

    render(<AtmosphereSummary weatherData={weatherData} />);

    expect(screen.getByText(/night conditions/i)).toBeInTheDocument();
  });

  it("shows reduced clarity for smoke conditions", () => {
    const weatherData = {
      ...baseWeatherData,
      weather: [
        {
          main: "Smoke",
          description: "smoky air",
          icon: "01d",
        },
      ],
    };

    render(<AtmosphereSummary weatherData={weatherData} />);

    expect(screen.getByText(/reduced clarity/i)).toBeInTheDocument();
    expect(
      screen.getByText(/reduced air clarity detected/i)
    ).toBeInTheDocument();
  });

  it("shows moist conditions for rain", () => {
    const weatherData = {
      ...baseWeatherData,
      weather: [
        {
          main: "Rain",
          description: "light rain",
          icon: "10d",
        },
      ],
    };

    render(<AtmosphereSummary weatherData={weatherData} />);

    expect(screen.getByText(/moist conditions/i)).toBeInTheDocument();
    expect(
      screen.getByText(/moisture-rich air conditions/i)
    ).toBeInTheDocument();
  });

  it("shows humid when humidity is above 80", () => {
    const weatherData = {
      ...baseWeatherData,
      main: {
        ...baseWeatherData.main,
        humidity: 85,
      },
    };

    render(<AtmosphereSummary weatherData={weatherData} />);

    expect(screen.getAllByText(/humid/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/high humidity may make the air feel heavier/i)
    ).toBeInTheDocument();
  });

  it("shows hot when temperature is above 30", () => {
    const weatherData = {
      ...baseWeatherData,
      main: {
        ...baseWeatherData.main,
        temp: 33,
        feels_like: 35,
        humidity: 50,
      },
    };

    render(<AtmosphereSummary weatherData={weatherData} />);

    expect(screen.getAllByText(/hot/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/hot outdoor conditions/i)
    ).toBeInTheDocument();
  });

  it("shows windy when wind speed is above 10", () => {
    const weatherData = {
      ...baseWeatherData,
      wind: {
        speed: 12,
      },
      main: {
        ...baseWeatherData.main,
        humidity: 50,
        temp: 22,
      },
    };

    render(<AtmosphereSummary weatherData={weatherData} />);

    expect(screen.getAllByText(/windy/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/windy conditions may help disperse local pollutants/i)
    ).toBeInTheDocument();
  });
});