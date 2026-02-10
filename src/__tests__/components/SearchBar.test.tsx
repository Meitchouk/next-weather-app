import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/SearchBar";

describe("SearchBar component", () => {
  it("should render the input and button", () => {
    render(<SearchBar onSearch={jest.fn()} isLoading={false} />);

    expect(
      screen.getByLabelText(/nombre de la ciudad/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /buscar/i })
    ).toBeInTheDocument();
  });

  it("should call onSearch with the trimmed city name on form submit", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(<SearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByLabelText(/nombre de la ciudad/i);
    const button = screen.getByRole("button", { name: /buscar/i });

    await user.type(input, "  Buenos Aires  ");
    await user.click(button);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("Buenos Aires");
  });

  it("should not call onSearch when the input is empty", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(<SearchBar onSearch={onSearch} isLoading={false} />);

    const button = screen.getByRole("button", { name: /buscar/i });
    await user.click(button);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should disable the button and input while loading", () => {
    render(<SearchBar onSearch={jest.fn()} isLoading={true} />);

    expect(screen.getByLabelText(/nombre de la ciudad/i)).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent(/buscando/i);
  });

  it("should submit on Enter key press", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(<SearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByLabelText(/nombre de la ciudad/i);
    await user.type(input, "Tokyo{enter}");

    expect(onSearch).toHaveBeenCalledWith("Tokyo");
  });
});
