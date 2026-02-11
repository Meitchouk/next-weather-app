import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { SearchHistory } from "@/components/molecules/SearchHistory";

const user = userEvent.setup({ pointerEventsCheck: 0 });

describe("SearchHistory component", () => {
  it("should not render when history is empty", () => {
    const { container } = render(
      <SearchHistory history={[]} onSelect={jest.fn()} onClear={jest.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should display history items as chips", () => {
    const history = ["Madrid", "Barcelona", "Valencia"];
    render(
      <SearchHistory history={history} onSelect={jest.fn()} onClear={jest.fn()} />,
    );

    expect(screen.getByText("Madrid")).toBeInTheDocument();
    expect(screen.getByText("Barcelona")).toBeInTheDocument();
    expect(screen.getByText("Valencia")).toBeInTheDocument();
  });

  it("should display history title and clear option", () => {
    const history = ["Madrid"];
    render(
      <SearchHistory history={history} onSelect={jest.fn()} onClear={jest.fn()} />,
    );

    // Check for history title (translations show "Búsquedas recientes")
    expect(screen.getByText("Búsquedas recientes")).toBeInTheDocument();
    // Check for clear option (translations show "Limpiar")
    expect(screen.getByText("Limpiar")).toBeInTheDocument();
  });

  it("should call onSelect when a history chip is clicked", async () => {
    const onSelect = jest.fn();
    const history = ["Madrid"];
    render(
      <SearchHistory history={history} onSelect={onSelect} onClear={jest.fn()} />,
    );

    const chip = screen.getByText("Madrid");
    await user.click(chip);

    expect(onSelect).toHaveBeenCalledWith("Madrid");
  });

  it("should call onClear when clear option is clicked", async () => {
    const onClear = jest.fn();
    const history = ["Madrid"];
    render(
      <SearchHistory history={history} onSelect={jest.fn()} onClear={onClear} />,
    );

    // Click the "Limpiar" (Clear) button
    const clearButton = screen.getByText("Limpiar");
    await user.click(clearButton);

    expect(onClear).toHaveBeenCalled();
  });

  it("should call onSelect with the correct city when multiple items are present", async () => {
    const onSelect = jest.fn();
    const history = ["Madrid", "Barcelona"];
    render(
      <SearchHistory history={history} onSelect={onSelect} onClear={jest.fn()} />,
    );

    const barcelonaChip = screen.getByText("Barcelona");
    await user.click(barcelonaChip);

    expect(onSelect).toHaveBeenCalledWith("Barcelona");
  });

  it("should have clickable history chips", () => {
    const history = ["London"];
    render(
      <SearchHistory history={history} onSelect={jest.fn()} onClear={jest.fn()} />,
    );

    const chip = screen.getByText("London").closest("[role='button']");
    expect(chip).toBeInTheDocument();
    expect(chip?.className).toContain("MuiChip-root");
  });
});
