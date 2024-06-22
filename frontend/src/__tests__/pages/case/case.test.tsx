import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Case from "../../../pages/case/case";

describe("Case Component", () => {
  beforeEach(() => {});

  it("should render the case component", () => {
    render(<Case />);
    const caseComponent = screen.getByTestId("case-component");
    expect(caseComponent).toBeInTheDocument();
  });

  // Add more test cases here...
});
