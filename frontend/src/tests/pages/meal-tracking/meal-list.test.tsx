import MealList, { MealEntry } from "../../../pages/meal-tracking/meal-list";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Meal } from "../../../types";

describe("MealEntry Component", () => {
  const mockMealEntry: Meal = {
    id: 0,
    user_id: 0,
    name: "Test Meal",
    date: new Date().toISOString(),
    ingredients: "Test ingredients",

    nutritions: {
      calories: 100,
      fat_total_g: 10,
      fat_saturated_g: 5,
      protein_g: 20,
      sodium_mg: 500,
      potassium_mg: 300,
      cholesterol_mg: 30,
      carbohydrates_total_g: 30,
      fiber_g: 5,
      sugar_g: 10,
    },
  };

  it("renders meal entry correctly", () => {
    render(<MealEntry meal_entry={mockMealEntry} />);

    expect(screen.getByText("Test Meal")).toBeInTheDocument();
    expect(screen.getByText("Test ingredients")).toBeInTheDocument();
    // Add more assertions as needed
  });

  it("expands and collapses meal entry on button click", () => {
    render(<MealEntry meal_entry={mockMealEntry} />);

    expect(screen.queryByText("Calories")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Show Nutritions"));
    expect(screen.getByText("Calories")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hide Nutritions"));
    expect(screen.queryByText("Calories")).not.toBeInTheDocument();
  });

  it("displays loading state correctly", async () => {
    render(<MealList />);
    expect(screen.getByText("Loading...")).toBeInstanceOf(HTMLParagraphElement);
  });

  it("displays error message when there is an error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Failed to load meals"));
    render(<MealList />);
    expect(await screen.findByText("Failed to load meals")).toBeInTheDocument();
  });

  it("renders the chart correctly when data is available", async () => {
    render(<MealList />);
    // expect(await screen.findByText("Weight Tracking Chart")).toBeInstanceOf(
    //   HTMLHeadingElement
    // );
    // expect(document.getElementsByTagName("canvas")[0]).toBeInTheDocument();
  });
});
