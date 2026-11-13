import { AREAS, getArea, type AreaId } from "./catalogo";
import type { Pedido } from "./pedidos";

export type EstadoLugares = "disponible" | "ultimos" | "completa";

export const ETIQUETAS: Record<EstadoLugares, string> = {
  disponible: "Lugares disponibles",
  ultimos: "Últimos lugares",
  completa: "Semana completa",
};

/** Cada pedido de la semana resta 1 al área completa, no al trámite. */
export function lugaresLibres(areaId: AreaId, pedidos: Pedido[], semana: string): number {
  const usados = pedidos.filter((p) => p.areaId === areaId && p.semana === semana).length;
  return Math.max(0, getArea(areaId).topeSemanal - usados);
}

export function estadoLugares(libres: number): EstadoLugares {
  if (libres <= 0) return "completa";
  if (libres <= 2) return "ultimos";
  return "disponible";
}

export interface ResumenArea {
  areaId: AreaId;
  libres: number;
  estado: EstadoLugares;
  etiqueta: string;
  puedePedir: boolean;
}

export function resumenArea(areaId: AreaId, pedidos: Pedido[], semana: string): ResumenArea {
  const libres = lugaresLibres(areaId, pedidos, semana);
  const estado = estadoLugares(libres);
  return { areaId, libres, estado, etiqueta: ETIQUETAS[estado], puedePedir: estado !== "completa" };
}

export function resumenTodas(pedidos: Pedido[], semana: string): Record<AreaId, ResumenArea> {
  return Object.fromEntries(AREAS.map((a) => [a.id, resumenArea(a.id, pedidos, semana)])) as Record<AreaId, ResumenArea>;
}
