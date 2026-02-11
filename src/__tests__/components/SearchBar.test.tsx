import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { SearchBar } from "@/components/molecules/SearchBar";

// MUI buttons set pointer-events:none in JSDOM — skip that check
const user = userEvent.setup({ pointerEventsCheck: 0 });

describe("SearchBar component", () => {
  it("should render the input and button", () => {
    render(<SearchBar onSearch={jest.fn()} isLoading={false} />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument();
  });

  it("should call onSearch with the trimmed city name on form submit", async () => {
    const onSearch = jest.fn();

    render(<SearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /buscar/i });

    await user.type(input, "  Buenos Aires  ");
    await user.click(button);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("Buenos Aires");
  });

  it("should not call onSearch when the input is empty", async () => {
    const onSearch = jest.fn();

    render(<SearchBar onSearch={onSearch} isLoading={false} />);

    const button = screen.getByRole("button", { name: /buscar/i });
    await user.click(button);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should disable the button and input while loading", () => {
    render(<SearchBar onSearch={jest.fn()} isLoading={true} />);

    // MUI TextField wraps disabled in the inner <input>
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent(/buscando/i);
  });

  it("should submit on Enter key press", async () => {
    const onSearch = jest.fn();

    render(<SearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Tokyo");

    fireEvent.submit(input.closest("form")!);

    expect(onSearch).toHaveBeenCalledWith("Tokyo");
  });
});
