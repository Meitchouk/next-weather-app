import React from "react";
import { screen } from "@testing-library/react";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { Typography } from "@/components/atoms/Typography";

describe("Typography atom", () => {
  it("should render children text", () => {
    render(<Typography>Hello World</Typography>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("should forward the variant prop", () => {
    render(<Typography variant="h1">Title</Typography>);
    const el = screen.getByText("Title");
    expect(el.tagName).toBe("H1");
  });

  it("should apply additional props", () => {
    render(<Typography data-testid="custom">Content</Typography>);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });
});
