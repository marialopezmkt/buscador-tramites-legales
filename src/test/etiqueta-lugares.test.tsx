import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { EtiquetaLugares } from "@/components/EtiquetaLugares";
import { resumenArea } from "@/lib/eba/lugares";
import { iniciarAlmacen } from "@/lib/eba/almacen";
import type { Pedido } from "@/lib/eba/pedidos";

// Semana fija conocida: con la semilla, Familia queda en 4 libres, Sucesiones en 2 y Laboral en 0.
const AHORA = new Date("2026-11-12T12:00:00Z");

function semilla() {
  return iniciarAlmacen(localStorage, AHORA);
}

describe("Etiqueta de lugares", () => {
  beforeEach(() => localStorage.clear());

  it("muestra el número de lugares libres junto al estado", () => {
    const { pedidos, semana } = semilla();
    render(<EtiquetaLugares resumen={resumenArea("familia", pedidos, semana)} />);
    expect(screen.getByText("Lugares disponibles: 4")).toBeInTheDocument();
  });

  it("al sumar un pedido en Familia la etiqueta baja de 4 a 3", () => {
    const { pedidos, semana } = semilla();
    const nuevo: Pedido = { ...pedidos[0]!, id: "nuevo-familia", areaId: "familia" };
    render(<EtiquetaLugares resumen={resumenArea("familia", [...pedidos, nuevo], semana)} />);
    expect(screen.getByText("Lugares disponibles: 3")).toBeInTheDocument();
  });

  it("con 2 libres dice «Últimos lugares» y con 0 dice «Semana completa», sin número", () => {
    const { pedidos, semana } = semilla();
    render(<EtiquetaLugares resumen={resumenArea("sucesiones-vivienda", pedidos, semana)} />);
    expect(screen.getByText("Últimos lugares: 2")).toBeInTheDocument();

    render(<EtiquetaLugares resumen={resumenArea("laboral", pedidos, semana)} />);
    expect(screen.getByText("Semana completa")).toBeInTheDocument();
  });
});
