import type { Pedido } from "./pedidos";
import { crearSemilla } from "./semilla";
import { semanaISO } from "./semana";

export const CLAVES = {
  version: "eba:version",
  semana: "eba:semana",
  pedidos: "eba:pedidos",
} as const;

export const VERSION_DATOS = 1;

export interface EstadoGuardado {
  semana: string;
  pedidos: Pedido[];
}

function leerPedidos(storage: Storage): Pedido[] | null {
  const crudo = storage.getItem(CLAVES.pedidos);
  if (crudo === null) return null;
  try {
    const datos = JSON.parse(crudo);
    return Array.isArray(datos) ? (datos as Pedido[]) : [];
  } catch {
    return [];
  }
}

/**
 * Se llama al abrir la app (solo en el navegador).
 * - Sin la clave eba:pedidos: primera visita, se carga la semilla con la semana actual.
 *   Una lista vacía guardada NO es primera visita.
 * - Si la semana guardada no es la actual, se actualiza: los lugares vuelven al tope
 *   y los pedidos viejos se conservan.
 */
export function iniciarAlmacen(storage: Storage = window.localStorage, ahora: Date = new Date()): EstadoGuardado {
  const actual = semanaISO(ahora);
  let pedidos = leerPedidos(storage);

  if (pedidos === null) {
    pedidos = crearSemilla(actual, ahora);
    storage.setItem(CLAVES.pedidos, JSON.stringify(pedidos));
    storage.setItem(CLAVES.version, String(VERSION_DATOS));
  }
  if (storage.getItem(CLAVES.semana) !== actual) {
    storage.setItem(CLAVES.semana, actual);
  }
  return { semana: actual, pedidos };
}

/**
 * Guarda la lista completa de pedidos. Devuelve false si localStorage falla
 * (por ejemplo, cuota agotada), sin lanzar la excepción: quien llama decide
 * qué mostrar, y lo que el usuario escribió no se pierde ni se altera.
 */
export function guardarPedidos(pedidos: Pedido[], storage: Storage = window.localStorage): boolean {
  try {
    storage.setItem(CLAVES.pedidos, JSON.stringify(pedidos));
    return true;
  } catch {
    return false;
  }
}
