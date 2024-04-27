import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import MealChart from "../../../pages/dashboard/meal-chart";
import { MOCK_MEALS_RESPONSE } from "../../constants";

// Mock react-chartjs-2
vi.mock("react-chartjs-2", () => ({
  Bar: () => <canvas></canvas>, // Using a simple placeholder for the Bar chart
}));

describe("MealChart", () => {
  beforeAll(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_MEALS_RESPONSE,
    });
    //   .mockRejectedValue(new Error("Failed to fetch data"));
  });

  it("displays error message when there is an error", () => {
    render(<MealChart />);
    expect(screen.getByText("Error: Failed to fetch data")).toBeInTheDocument();
  });
  it("displays loading state correctly", () => {
    render(<MealChart />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the chart correctly when data is available", () => {
    render(<MealChart />);
    waitFor(
      () => {
        expect(screen.getByText("Meal Calories Chart")).toBeInTheDocument();
        expect(screen.getByRole("img")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
