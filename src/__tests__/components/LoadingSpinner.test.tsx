import React from "react";
import { screen } from "@testing-library/react";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { LoadingSpinner } from "@/components/molecules/LoadingSpinner";

describe("LoadingSpinner component", () => {
  it("should render with a status role", () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should have a screen-reader label", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });
});
