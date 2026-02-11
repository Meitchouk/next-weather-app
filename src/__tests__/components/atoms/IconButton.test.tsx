import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { IconButton } from "@/components/atoms/IconButton";

const user = userEvent.setup({ pointerEventsCheck: 0 });

describe("IconButton atom", () => {
  it("should render children (icon slot)", () => {
    render(
      <IconButton aria-label="test">
        <span data-testid="icon">★</span>
      </IconButton>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("should forward aria-label", () => {
    render(
      <IconButton aria-label="close">
        <span>×</span>
      </IconButton>
    );
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("should trigger onClick callback", async () => {
    const onClick = jest.fn();
    render(
      <IconButton onClick={onClick} aria-label="click me">
        <span>→</span>
      </IconButton>
    );

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should forward disabled prop", () => {
    render(
      <IconButton disabled aria-label="disabled">
        <span>×</span>
      </IconButton>
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
