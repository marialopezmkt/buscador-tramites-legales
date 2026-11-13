import { TRAMITES, type AreaId, type Tramite } from "./catalogo";

/** Minúsculas, sin tildes, sin espacios en los extremos. */
export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/**
 * Lo escrito tiene que estar CONTENIDO en el nombre o en una palabra clave. Nunca al revés:
 * así "me echaron" no trae "Desalojo" por su clave "echar".
 * Sin áreas elegidas = todas las áreas. Texto vacío = sin filtro de texto.
 */
export function buscarTramites(texto: string, areas: AreaId[] = [], catalogo: Tramite[] = TRAMITES): Tramite[] {
  const q = normalizar(texto);
  return catalogo.filter((t) => {
    if (areas.length > 0 && !areas.includes(t.areaId)) return false;
    if (!q) return true;
    return [t.nombre, ...t.palabrasClave].some((campo) => normalizar(campo).includes(q));
  });
}
