import { TRAMITES, type AreaId } from "./catalogo";
import type { Pedido } from "./pedidos";

// Pedidos iniciales por área: Laboral queda en 0, Familia en 4, Sucesiones y vivienda en 2.
const PERSONAS: Record<AreaId, { nombre: string; telefono: string }[]> = {
  laboral: [
    { nombre: "Martín Gómez", telefono: "11 4562-3381" },
    { nombre: "Lucía Fernández", telefono: "11 5823-1047" },
    { nombre: "Diego Romero", telefono: "351 642-8890" },
    { nombre: "Carla Benítez", telefono: "11 3398-7712" },
    { nombre: "Sergio Paz", telefono: "221 455-9031" },
    { nombre: "Valeria Sosa", telefono: "11 6120-4458" },
    { nombre: "Nicolás Herrera", telefono: "341 587-2264" },
    { nombre: "Florencia Ríos", telefono: "11 4791-0835" },
  ],
  familia: [
    { nombre: "Paula Medina", telefono: "11 5502-9174" },
    { nombre: "Javier Castro", telefono: "11 4378-6621" },
  ],
  "sucesiones-vivienda": [
    { nombre: "Graciela Acosta", telefono: "11 4216-5503" },
    { nombre: "Tomás Villalba", telefono: "261 498-3317" },
    { nombre: "Agustina Molina", telefono: "11 6634-2089" },
  ],
};

function correoDe(nombre: string): string {
  const base = nombre.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, ".");
  return `${base}@example.com`;
}

/** Se arma al momento (no a nivel de módulo) con la semana actual. */
export function crearSemilla(semana: string, ahora: Date = new Date()): Pedido[] {
  const pedidos: Pedido[] = [];
  (Object.keys(PERSONAS) as AreaId[]).forEach((areaId) => {
    const tramites = TRAMITES.filter((t) => t.areaId === areaId);
    PERSONAS[areaId].forEach((p, i) => {
      pedidos.push({
        id: `semilla-${areaId}-${i + 1}`,
        semana,
        areaId,
        tramiteId: tramites[i % tramites.length]?.id ?? null,
        nombre: p.nombre,
        correo: correoDe(p.nombre),
        telefono: p.telefono,
        comentario: "",
        estado: "Pedido",
        creadoEn: new Date(ahora.getTime() - (pedidos.length + 1) * 3600_000).toISOString(),
      });
    });
  });
  return pedidos;
}
