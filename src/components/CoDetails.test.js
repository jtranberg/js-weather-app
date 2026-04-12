import { render, screen, waitFor } from "@testing-library/react";
import CoDetails from "./CoDetails";
import axios from "axios";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

describe("CoDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows error when lat/lon are missing", () => {
    render(<CoDetails />);

    expect(
      screen.getByText(/missing coordinates for co lookup/i)
    ).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    axios.get.mockResolvedValueOnce({
      data: {
        list: [
          {
            components: { co: 3000 },
          },
        ],
      },
    });

    render(<CoDetails lat={49.28} lon={-123.12} />);

    expect(screen.getByText(/loading co data/i)).toBeInTheDocument();
  });

  it("renders CO data correctly on success", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        list: [
          {
            components: { co: 3000 },
          },
        ],
      },
    });

    render(<CoDetails lat={49.28} lon={-123.12} />);

    await waitFor(() => {
      expect(screen.getByText(/3000/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/very low/i)).toBeInTheDocument();
    expect(
      screen.getByText(/clean air\. no immediate carbon monoxide concern detected/i)
    ).toBeInTheDocument();
  });

  it("renders higher CO levels correctly", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        list: [
          {
            components: { co: 20000 },
          },
        ],
      },
    });

    render(<CoDetails lat={49.28} lon={-123.12} />);

    await waitFor(() => {
      expect(screen.getByText(/20000/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/^high$/i)).toBeInTheDocument();
    expect(
      screen.getByText(/extended exposure may cause symptoms in some people/i)
    ).toBeInTheDocument();
  });

  it("shows error when API fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("API failed"));

    render(<CoDetails lat={49.28} lon={-123.12} />);

    await waitFor(() => {
      expect(screen.getByText(/api failed/i)).toBeInTheDocument();
    });
  });
});