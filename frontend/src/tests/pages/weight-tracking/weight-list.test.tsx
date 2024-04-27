import WeightItem from "../../../pages/weight-tracking/weight-list";
import { getDateMedium, getTimeShort } from "../../../utils/parse-time";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MOCK_WEIGHT_RESPONSE } from "../../constants";

describe("WeightList", () => {
  beforeEach(() => {
    // Mock successful fetch response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_WEIGHT_RESPONSE,
    });
  });

  it("displays error message when there is an error", async () => {
    // Mock failed fetch response
    global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch data"));
    render(<WeightItem />);
    expect(
      await screen.findByText("Error: Failed to fetch data")
    ).toBeInTheDocument();
  });

  it("displays loading state correctly", async () => {
    render(<WeightItem />);
    // Check if the loading message is rendered and is an instance of HTMLParagraphElement
    expect(await screen.findByText("Loading...")).toBeInstanceOf(
      HTMLParagraphElement
    );
  });

  it("renders the chart correctly when data is available", async () => {
    render(<WeightItem />);
    expect(
      await screen.findByText(
        `${getDateMedium(MOCK_WEIGHT_RESPONSE[0].date)} at ${getTimeShort(
          MOCK_WEIGHT_RESPONSE[0].date
        )}`
      )
    ).toBeInstanceOf(HTMLParagraphElement);
  });
});
