import { render, screen } from "@testing-library/react";
import App from "./App";
jest.mock("./components/WeatherForm", () => function MockWeatherForm() {
  return <div>Mock WeatherForm</div>;
});

jest.mock("./components/CoDetails", () => function MockCoDetails() {
  return <div>Mock CoDetails</div>;
});



describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText(/mock weatherform/i)).toBeInTheDocument();
  });

  it("renders the app heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /brave enough to breathe/i })).toBeInTheDocument();
  });

  it("renders the app subtitle", () => {
    render(<App />);
    expect(
      screen.getByText(/real-time atmospheric conditions, forecasts, and breathing intelligence/i)
    ).toBeInTheDocument();
  });
});