import { render } from "@testing-library/react";
import Container from "../../components/container";

describe("Container", () => {
    it("renders children", () => {
        const { getByText } = render(
            <Container>
                <p>Hello World</p>
            </Container>
        );

        expect(getByText("Hello World")).toBeInTheDocument();
    });
});
