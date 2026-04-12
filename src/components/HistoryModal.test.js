import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HistoryModal from "./HistoryModal";

describe("HistoryModal", () => {
  const mockHistory = ["Vancouver, CA", "Seattle, US", "Toronto, CA"];
  const setWeatherData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the View History button", () => {
    render(
      <HistoryModal
        history={mockHistory}
        setWeatherData={setWeatherData}
      />
    );

    expect(
      screen.getByRole("button", { name: /view history/i })
    ).toBeInTheDocument();
  });

  it("opens the modal when View History is clicked", () => {
    render(
      <HistoryModal
        history={mockHistory}
        setWeatherData={setWeatherData}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /view history/i }));

    expect(screen.getByText(/search history/i)).toBeInTheDocument();
    expect(screen.getByText(/vancouver, ca/i)).toBeInTheDocument();
    expect(screen.getByText(/seattle, us/i)).toBeInTheDocument();
    expect(screen.getByText(/toronto, ca/i)).toBeInTheDocument();
  });

  it("calls setWeatherData when a history item is selected", () => {
    render(
      <HistoryModal
        history={mockHistory}
        setWeatherData={setWeatherData}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /view history/i }));
    fireEvent.click(screen.getByText(/seattle, us/i));

    expect(setWeatherData).toHaveBeenCalledWith("Seattle, US");
  });

  it("closes the modal when Close is clicked", async () => {
    render(
      <HistoryModal
        history={mockHistory}
        setWeatherData={setWeatherData}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /view history/i }));
    expect(screen.getByText(/search history/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/^close$/i));

    await waitFor(() => {
      expect(screen.queryByText(/search history/i)).not.toBeInTheDocument();
    });
  });
});