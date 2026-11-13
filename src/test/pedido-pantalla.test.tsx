import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { PedidosProvider } from "@/context/PedidosContext";
import { Pedido } from "@/pages/Pedido";
import { CLAVES } from "@/lib/eba/almacen";

// Semana fija conocida, con Familia en 4 libres y Laboral en 0 (ver semilla).
const AHORA = new Date("2026-11-12T12:00:00Z");

function renderPedido(ruta: string) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <PedidosProvider ahora={AHORA}>
        <Routes>
          <Route path="/consulta/:areaId" element={<Pedido />} />
        </Routes>
      </PedidosProvider>
    </MemoryRouter>,
  );
}

describe("Pantalla de pedido", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("no envía con campos inválidos y muestra un mensaje por cada uno", async () => {
    renderPedido("/consulta/familia");
    fireEvent.click(await screen.findByRole("button", { name: /pedir mi lugar/i }));

    expect(await screen.findByText(/contanos tu nombre y apellido/i)).toBeInTheDocument();
    expect(screen.getByText(/correo para confirmarte/i)).toBeInTheDocument();
    expect(screen.getByText(/teléfono de contacto/i)).toBeInTheDocument();
    // No hay pantalla de confirmación.
    expect(screen.queryByText(/pedido recibido/i)).not.toBeInTheDocument();
  });

  it("con todos los campos válidos, guarda el pedido y resta un lugar sin recargar", async () => {
    renderPedido("/consulta/familia");

    fireEvent.change(screen.getByLabelText(/nombre y apellido/i), { target: { value: "Ana Paz" } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "ana@example.com" } });
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: "11 4000-1234" } });
    fireEvent.click(screen.getByRole("button", { name: /pedir mi lugar/i }));

    expect(await screen.findByText(/pedido recibido/i)).toBeInTheDocument();

    const guardados = JSON.parse(localStorage.getItem(CLAVES.pedidos)!);
    expect(guardados).toHaveLength(13 + 1); // 13 de la semilla + este
    expect(guardados.at(-1)).toMatchObject({ areaId: "familia", correo: "ana@example.com" });
  });

  it("un segundo pedido con el mismo correo en la misma área no descuenta otro lugar", async () => {
    renderPedido("/consulta/familia");
    const completar = () => {
      fireEvent.change(screen.getByLabelText(/nombre y apellido/i), { target: { value: "Ana Paz" } });
      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: " Ana@Example.com " } });
      fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: "11 4000-1234" } });
    };

    completar();
    fireEvent.click(screen.getByRole("button", { name: /pedir mi lugar/i }));
    await screen.findByText(/pedido recibido/i);

    // Vuelve a entrar al formulario (otra persona pediría desde la ficha; acá simulamos un segundo intento).
    renderPedido("/consulta/familia");
    completar();
    fireEvent.click(screen.getAllByRole("button", { name: /pedir mi lugar/i }).at(-1)!);

    expect(await screen.findByText(/ya tenés un lugar apartado/i)).toBeInTheDocument();
    const guardados = JSON.parse(localStorage.getItem(CLAVES.pedidos)!);
    expect(guardados).toHaveLength(13 + 1); // no se sumó un segundo pedido
  });

  it("con el área en 'Semana completa' no muestra el formulario", async () => {
    renderPedido("/consulta/laboral");
    expect(await screen.findByText(/se quedó sin lugares/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /pedir mi lugar/i })).not.toBeInTheDocument();
  });
});
