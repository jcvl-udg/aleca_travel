import { fireEvent, render, screen } from "@testing-library/react";
import { TravelSearch } from "./travel-search";

describe("TravelSearch", () => {
  it("expande el primer paso al pulsar la barra de destino", () => {
    render(<TravelSearch onSelect={() => undefined} onOpenDetails={() => undefined} />);

    expect(screen.queryByLabelText("Buscar destinos")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /a dónde vas/i }));

    expect(screen.getByLabelText("Buscar destinos")).toBeVisible();
    expect(screen.getByRole("button", { name: /continuar con las fechas/i })).toBeDisabled();
  });
});