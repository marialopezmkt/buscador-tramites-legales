import type { AreaId } from "./catalogo";

export interface Pedido {
  id: string;
  semana: string; // ej. "2026-W46"
  areaId: AreaId;
  tramiteId: string | null;
  nombre: string;
  correo: string;
  telefono: string;
  comentario: string;
  estado: "Pedido";
  creadoEn: string; // ISO
}
