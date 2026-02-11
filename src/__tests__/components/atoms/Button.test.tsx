import React from "react";
import { screen } from "@testing-library/react";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { Button } from "@/components/atoms/Button";

describe("Button atom", () => {
  it("should render children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("should default to variant='contained' and disableElevation", () => {
    render(<Button>Test</Button>);
    const btn = screen.getByRole("button");
    // MUI contained buttons have the MuiButton-contained class
    expect(btn).toHaveClass("MuiButton-contained");
    expect(btn).toHaveClass("MuiButton-disableElevation");
  });

  it("should forward extra props to the underlying MUI Button", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should allow overriding the default variant", () => {
    render(<Button variant="outlined">Outlined</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("MuiButton-outlined");
  });
});
