import type { AreaId } from "./catalogo";
import type { Pedido } from "./pedidos";

/**
 * Validación del formulario de pedido (brief.md, "Decisiones tomadas", punto 5).
 * Cada función devuelve un mensaje de error, o null si el campo es válido.
 */

export function validarNombre(valor: string): string | null {
  const limpio = valor.trim();
  if (!limpio) return "Contanos tu nombre y apellido.";
  if (limpio.split(/\s+/).length < 2) return "Poné nombre y apellido.";
  return null;
}

export function validarCorreo(valor: string): string | null {
  const limpio = valor.trim();
  if (!limpio) return "Dejanos un correo para confirmarte el lugar.";
  // Formato básico: algo@algo.algo, sin espacios.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) return "Revisá el correo, no parece válido.";
  return null;
}

export function validarTelefono(valor: string): string | null {
  const limpio = valor.trim();
  if (!limpio) return "Dejanos un teléfono de contacto.";
  const soloDigitos = limpio.replace(/[\s\-+]/g, "");
  if (!/^\d+$/.test(soloDigitos) || soloDigitos.length < 8 || soloDigitos.length > 15) {
    return "Revisá el teléfono: entre 8 y 15 números, podés usar espacios o guiones.";
  }
  return null;
}

export function validarComentario(valor: string): string | null {
  if (valor.length > 300) return "El comentario puede tener hasta 300 caracteres.";
  return null;
}

/** Normaliza un correo para comparar duplicados: sin espacios en los extremos, en minúsculas. */
export function normalizarCorreo(correo: string): string {
  return correo.trim().toLowerCase();
}

/**
 * Duplicado = mismo correo + misma área + misma semana (brief.md, decisión 6).
 * El trámite no importa para esta regla.
 */
export function esDuplicado(pedidos: Pedido[], correo: string, areaId: AreaId, semana: string): boolean {
  const correoNorm = normalizarCorreo(correo);
  return pedidos.some(
    (p) => normalizarCorreo(p.correo) === correoNorm && p.areaId === areaId && p.semana === semana,
  );
}
