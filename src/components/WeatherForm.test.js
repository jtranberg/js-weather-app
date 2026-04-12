import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WeatherForm from "./WeatherForm";
import axios from "axios";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

describe("WeatherForm", () => {
  const setWeatherData = jest.fn();
  const setForecastData = jest.fn();
  const addToHistory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  it("renders the form inputs and buttons", () => {
    render(
      <WeatherForm
        setWeatherData={setWeatherData}
        setForecastData={setForecastData}
        addToHistory={addToHistory}
      />
    );

    expect(screen.getByPlaceholderText(/enter city/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter country code/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /current location/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show forecast/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get weather/i })).toBeInTheDocument();
  });

  it("updates the city and country inputs when the user types", () => {
    render(
      <WeatherForm
        setWeatherData={setWeatherData}
        setForecastData={setForecastData}
        addToHistory={addToHistory}
      />
    );

    const cityInput = screen.getByPlaceholderText(/enter city/i);
    const countryInput = screen.getByPlaceholderText(/enter country code/i);

    fireEvent.change(cityInput, { target: { value: "Vancouver" } });
    fireEvent.change(countryInput, { target: { value: "CA" } });

    expect(cityInput.value).toBe("Vancouver");
    expect(countryInput.value).toBe("CA");
  });

  it("alerts if location or country code is missing when getting weather", () => {
    render(
      <WeatherForm
        setWeatherData={setWeatherData}
        setForecastData={setForecastData}
        addToHistory={addToHistory}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /get weather/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "Please enter both location and country code."
    );
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("fetches weather by location and updates app state", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        name: "Vancouver",
        sys: { country: "CA" },
        main: { temp: 18, humidity: 70 },
        wind: { speed: 3 },
        weather: [{ description: "clear sky", icon: "01d" }],
      },
    });

    render(
      <WeatherForm
        setWeatherData={setWeatherData}
        setForecastData={setForecastData}
        addToHistory={addToHistory}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/enter city/i), {
      target: { value: "Vancouver" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter country code/i), {
      target: { value: "CA" },
    });

    fireEvent.click(screen.getByRole("button", { name: /get weather/i }));

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get.mock.calls[0][0]).toContain("q=Vancouver,CA");

    await waitFor(() => {
      expect(setWeatherData).toHaveBeenCalledWith({
        name: "Vancouver",
        sys: { country: "CA" },
        main: { temp: 18, humidity: 70 },
        wind: { speed: 3 },
        weather: [{ description: "clear sky", icon: "01d" }],
      });
    });

    expect(addToHistory).toHaveBeenCalledWith("Vancouver, CA");
  });

  it("alerts when weather fetch fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("API failed"));

    render(
      <WeatherForm
        setWeatherData={setWeatherData}
        setForecastData={setForecastData}
        addToHistory={addToHistory}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/enter city/i), {
      target: { value: "Vancouver" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter country code/i), {
      target: { value: "CA" },
    });

    fireEvent.click(screen.getByRole("button", { name: /get weather/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to fetch weather data.");
    });

    expect(setWeatherData).not.toHaveBeenCalled();
  });

  it("fetches forecast data when Show Forecast is clicked", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        list: [{ dt: 123, main: { temp: 17 } }],
      },
    });

    render(
      <WeatherForm
        setWeatherData={setWeatherData}
        setForecastData={setForecastData}
        addToHistory={addToHistory}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/enter city/i), {
      target: { value: "Vancouver" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter country code/i), {
      target: { value: "CA" },
    });

    fireEvent.click(screen.getByRole("button", { name: /show forecast/i }));

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get.mock.calls[0][0]).toContain("forecast?q=Vancouver,CA");

    await waitFor(() => {
      expect(setForecastData).toHaveBeenCalledWith({
        list: [{ dt: 123, main: { temp: 17 } }],
      });
    });
  });
});