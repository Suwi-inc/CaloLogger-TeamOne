import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SaveMealModel } from "../../../pages/meal-tracking/meal-form";

describe("AddMealModal", () => {
    const setShowModal = vi.fn();
    const mockRef = { current: { showModal: vi.fn(), close: vi.fn() } };
    const mockSearchResult = {
        title: "Test Meal",
        ingredients: "Test ingredients",
    };
    beforeEach(() => {
        React.useRef = vi.fn().mockReturnValue(mockRef);
        global.fetch = vi.fn().mockResolvedValue({
            json: { title: "Test Meal", ingredients: "Test ingredients" },
        });
    });

    it("renders the modal correctly", () => {
        render(
            <SaveMealModel
                setShowModal={setShowModal}
                meal_entry={mockSearchResult}
            />
        );

        expect(screen.getByText("Ingredients")).toBeInTheDocument();
        expect(screen.getByLabelText("Date & Time")).toBeInTheDocument();
        expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("check for invalid form data", () => {
        window.alert = vi.fn();

        render(
            <SaveMealModel
                setShowModal={setShowModal}
                meal_entry={mockSearchResult}
            />
        );

        const saveButton = screen.getByRole("button", { name: "Save" });

        // Test ingredients input field with empty value
        const ingredientsInput = screen.getByLabelText("Ingredients");
        fireEvent.change(ingredientsInput, { target: { value: "" } });
        fireEvent.click(saveButton);

        // The button text should still be "Add" since the form is invalid
        expect(screen.getByText("Save")).toBeInTheDocument();
        // Alert should be called with the message "Weight must be a number"
        expect(window.alert).toHaveBeenCalledWith("Please fill all fields");
    });
});
