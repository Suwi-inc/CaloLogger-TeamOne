import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MOCK_WEIGHT_RESPONSE } from "../../constants";
import WeightChart from "../../../pages/dashboard/weight-chart";

// Mock react-chartjs-2
vi.mock("react-chartjs-2", () => ({
    Line: () => <canvas></canvas>, // Using a simple placeholder for the Bar chart
}));

describe("WeightChart", () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => MOCK_WEIGHT_RESPONSE,
        });
    });

    it("displays error message when there is an error", async () => {
        global.fetch = vi
            .fn()
            .mockRejectedValue(new Error("Failed to fetch data"));
        render(<WeightChart />);
        expect(
            await screen.findByText("Error: Failed to fetch data")
        ).toBeInTheDocument();
    });

    it("displays loading state correctly", async () => {
        render(<WeightChart />);
        expect(screen.getByText("Loading...")).toBeInstanceOf(
            HTMLParagraphElement
        );
    });

    it("renders the chart correctly when data is available", async () => {
        render(<WeightChart />);
        expect(await screen.findByText("Weight Tracking Chart")).toBeInstanceOf(
            HTMLHeadingElement
        );
        expect(document.getElementsByTagName("canvas")[0]).toBeInTheDocument();
    });
});
