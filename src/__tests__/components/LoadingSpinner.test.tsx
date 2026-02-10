import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
