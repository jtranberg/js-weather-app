import { render, screen } from "@testing-library/react";
import Co2EraComparison from "./Co2EraComparison";

describe("Co2EraComparison", () => {
  it("shows waiting message when no data is provided", () => {
    render(<Co2EraComparison />);

    expect(
      screen.getByText(/waiting for current global co₂ data/i)
    ).toBeInTheDocument();
  });

  it("renders core sections when valid CO2 is provided", () => {
    render(<Co2EraComparison currentCO2={420} />);

    expect(screen.getByText(/co₂ through time/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/pre-industrial baseline/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/^today$/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/deep-past reference/i)).toBeInTheDocument();
  });

  it("calculates and displays delta from past correctly", () => {
    render(<Co2EraComparison currentCO2={420} />);

    expect(screen.getByText(/\+\s*140\.00\s*ppm/i)).toBeInTheDocument();
  });

  it("calculates percent above past correctly", () => {
    render(<Co2EraComparison currentCO2={420} />);

    expect(screen.getByText(/\+?\s*50\s*%/i)).toBeInTheDocument();
  });

  it("calculates ratio vs deep past correctly", () => {
    render(<Co2EraComparison currentCO2={420} />);

    expect(screen.getByText(/28\s*%/i)).toBeInTheDocument();
  });

  it("renders correct level label for moderate increase", () => {
    render(<Co2EraComparison currentCO2={420} />);

    expect(screen.getByText(/elevated from past/i)).toBeInTheDocument();
  });

  it("renders correct level label for low delta", () => {
    render(<Co2EraComparison currentCO2={300} />);

    expect(
      screen.getByText(/near historical baseline/i)
    ).toBeInTheDocument();
  });

  it("renders correct level label for high delta", () => {
    render(<Co2EraComparison currentCO2={500} />);

    expect(screen.getByText(/modern high/i)).toBeInTheDocument();
  });

  it("renders advisory text", () => {
    render(<Co2EraComparison currentCO2={420} />);

    expect(
      screen.getByText(/modern atmospheric co₂ is clearly above/i)
    ).toBeInTheDocument();
  });
});