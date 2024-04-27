import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AddWeightModal from "../../../pages/weight-tracking/add-weight";
import React from "react";

// Mocking the swr/immutable import
vi.mock("swr/immutable", () => ({
  __esModule: true,
  default: vi.fn(),
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
  });

  //   it("submits the form with valid data", async () => {
  //     const triggerMock = vi.fn();

  //     render(<AddWeightModal openModal={true} setShowModal={setShowModal} />);

  //     const weightInput = screen.getByLabelText("Weight (KG)");
  //     const dateInput = screen.getByLabelText("Date");
  //     const timeInput = screen.getByLabelText("Time");
  //     const addButton = screen.getByRole("button", { name: "Add" });

  //     fireEvent.change(weightInput, { target: { value: "75" } });
  //     fireEvent.change(dateInput, { target: { value: "2022-01-01" } });
  //     fireEvent.change(timeInput, { target: { value: "12:00" } });
  //     fireEvent.click(addButton);

  //     expect(triggerMock).toHaveBeenCalledWith({
  //       weight: 75,
  //       date: "2022-01-01T12:00:00",
  //     });
  //     expect(setShowModal).toHaveBeenCalledWith(false);
  //   });

  //   it("displays an error message when form data is invalid", () => {
  //     render(<AddWeightModal openModal={true} setShowModal={setShowModal} />);

  //     const addButton = screen.getByRole("button", { name: "Add" });
  //     fireEvent.click(addButton);

  //     expect(screen.getByText("Please fill all fields")).toBeInTheDocument();
  //   });

  //   it("displays a loading state when submitting the form", () => {
  //     useSWRMutation.mockReturnValue({ trigger: jest.fn(), isMutating: true });

  //     render(<AddWeightModal openModal={true} setShowModal={setShowModal} />);

  //     const addButton = screen.getByRole("button", { name: "Add" });

  //     fireEvent.click(addButton);

  //     expect(screen.getByText("Adding...")).toBeInTheDocument();
  //   });
});
