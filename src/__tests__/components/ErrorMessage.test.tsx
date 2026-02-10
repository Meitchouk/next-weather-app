import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "@/components/ErrorMessage";

describe("ErrorMessage component", () => {
  it("should display the error message", () => {
    render(<ErrorMessage message="Ciudad no encontrada" />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Ciudad no encontrada"
    );
  });

  it("should have an alert role for accessibility", () => {
    render(<ErrorMessage message="Error genérico" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
