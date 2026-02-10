import React from "react";
import { screen } from "@testing-library/react";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { ErrorMessage } from "@/components/molecules/ErrorMessage";

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
