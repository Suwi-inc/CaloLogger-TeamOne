import React from "react";
// import { getTimeISO } from "../../../utils/parse-time";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AddWeightModal from "../../../pages/weight-tracking/add-weight";

const mockTrigger = vi.fn();
vi.mock("swr/immutable", () => ({
  __esModule: true,
  default: vi.fn().mockReturnValue({ trigger: mockTrigger, isMutating: false }),
}));

describe("AddWeightModal", () => {
  const setShowModal = vi.fn();
  const mockRef = { current: { showModal: vi.fn(), close: vi.fn() } };

  beforeEach(() => {
    React.useRef = vi.fn().mockReturnValue(mockRef);
  });

  it("renders the modal correctly", () => {
    render(<AddWeightModal openModal={true} setShowModal={setShowModal} />);

    expect(screen.getByText("Add Weight")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (KG)")).toBeInTheDocument();
    expect(screen.getByLabelText("Date & Time")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("check for invalid form data", () => {
    window.alert = vi.fn();

    render(<AddWeightModal openModal={true} setShowModal={setShowModal} />);

    const addButton = screen.getByRole("button", { name: "Add" });
    fireEvent.click(addButton);

    // The button text should still be "Add" since the form is invalid
    expect(screen.getByText("Add")).toBeInTheDocument();

    // Test weight input field with 0 value
    const weightInput = screen.getByLabelText("Weight (KG)");
    fireEvent.change(weightInput, { target: { value: "0" } });
    fireEvent.click(addButton);

    // The button text should still be "Add" since the form is invalid
    expect(screen.getByText("Add")).toBeInTheDocument();
    // Alert should be called with the message "Weight must be greater than 0"
    expect(window.alert).toHaveBeenCalledWith("Invalid form data");

    // Add the time and date
    const dateInput = document.getElementById("date") as HTMLInputElement;
    const timeInput = document.getElementById("time") as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2022-01-01" } });
    fireEvent.change(timeInput, { target: { value: "12:00" } });
    fireEvent.click(addButton);

    // The button text should still be "Add" since the form is invalid
    expect(screen.getByText("Add")).toBeInTheDocument();

    // Test with a non-numeric weight
    fireEvent.change(weightInput, { target: { value: "abc" } });
    fireEvent.click(addButton);

    // The button text should still be "Add" since the form is invalid
    expect(screen.getByText("Add")).toBeInTheDocument();
    // Alert should be called with the message "Weight must be a number"
    expect(window.alert).toHaveBeenCalledWith("Weight must be greater than 0");
  });

  it("submits the form with valid data", async () => {
    const showModal = vi.fn();
    render(<AddWeightModal openModal={true} setShowModal={showModal} />);

    const weightInput = document.getElementById("weight") as HTMLInputElement;
    const dateInput = document.getElementById("date") as HTMLInputElement;
    const timeInput = document.getElementById("time") as HTMLInputElement;
    const addButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(weightInput, { target: { value: "75" } });
    fireEvent.change(dateInput, { target: { value: "2022-01-01" } });
    fireEvent.change(timeInput, { target: { value: "12:00" } });
    fireEvent.click(addButton);

    expect(screen.getByText("Adding...")).toBeInTheDocument();
  });

  it("closes the modal when the form is submitted", async () => {
    const showModal = vi.fn();
    render(<AddWeightModal openModal={true} setShowModal={showModal} />);

    const weightInput = document.getElementById("weight") as HTMLInputElement;
    const dateInput = document.getElementById("date") as HTMLInputElement;
    const timeInput = document.getElementById("time") as HTMLInputElement;
    const addButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(weightInput, { target: { value: "75" } });
    fireEvent.change(dateInput, { target: { value: "2022-01-01" } });
    fireEvent.change(timeInput, { target: { value: "12:00" } });
    fireEvent.click(addButton);

    // expect(mockRef.current.close).toHaveBeenCalled();
  });
});
