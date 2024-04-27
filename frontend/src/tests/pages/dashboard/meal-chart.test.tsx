import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MealChart from "../../../pages/dashboard/meal-chart";
import { MOCK_MEALS_RESPONSE } from "../../constants";

// Mock react-chartjs-2
vi.mock("react-chartjs-2", () => ({
  Bar: () => <canvas></canvas>, // Using a simple placeholder for the Bar chart
}));

describe("MealChart", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_MEALS_RESPONSE,
    });
  });

  it("displays error message when there is an error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch data"));
    render(<MealChart />);
    expect(
      await screen.findByText("Error: Failed to fetch data")
    ).toBeInTheDocument();
  });

  it("displays loading state correctly", async () => {
    render(<MealChart />);
    expect(screen.getByText("Loading...")).toBeInstanceOf(HTMLParagraphElement);
  });

  it("renders the chart correctly when data is available", async () => {
    render(<MealChart />);
    expect(await screen.findByText("Meal Calories Chart")).toBeInstanceOf(
      HTMLHeadingElement
    );
    expect(document.getElementsByTagName("canvas")[0]).toBeInTheDocument();
  });
});
