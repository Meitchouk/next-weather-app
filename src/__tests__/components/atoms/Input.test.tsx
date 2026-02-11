import React from "react";
import { screen } from "@testing-library/react";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { Input } from "@/components/atoms/Input";

describe("Input atom", () => {
  it("should render a text input", () => {
    render(<Input aria-label="test input" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should default to fullWidth", () => {
    const { container } = render(<Input aria-label="test input" />);
    const root = container.querySelector(".MuiTextField-root");
    expect(root).toHaveClass("MuiFormControl-fullWidth");
  });

  it("should forward disabled prop", () => {
    render(<Input aria-label="test input" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("should render placeholder text", () => {
    render(<Input placeholder="Enter value" aria-label="test input" />);
    expect(screen.getByPlaceholderText("Enter value")).toBeInTheDocument();
  });
});
