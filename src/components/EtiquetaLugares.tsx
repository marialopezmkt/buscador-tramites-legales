import type { ResumenArea } from "@/lib/eba/lugares";

/**
 * El terracota marca lugares disponibles (sección "Identidad visual" del brief).
 * "Disponible" y "Últimos lugares" se diferencian por intensidad dentro del mismo
 * color; "Semana completa" no tiene lugares que marcar, así que usa el gris neutro.
 */
export function EtiquetaLugares({ resumen }: { resumen: ResumenArea }) {
  const estilos: Record<ResumenArea["estado"], string> = {
    disponible: "bg-[color-mix(in_srgb,var(--color-terracota)_12%,white)] text-[color:var(--color-terracota)]",
    ultimos: "bg-[var(--color-terracota)] text-white font-semibold",
    completa: "bg-[color-mix(in_srgb,var(--color-gris)_14%,white)] text-[color:var(--color-gris)]",
  };

  // El número de lugares libres va junto al estado para que el descuento se vea en
  // todas las fichas del área (brief: "Reservar Familia cambia todas las fichas de
  // esa área de 4 a 3"). "Semana completa" no lleva número: no hay lugares que contar.
  const texto =
    resumen.estado === "completa" ? resumen.etiqueta : `${resumen.etiqueta}: ${resumen.libres}`;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${estilos[resumen.estado]}`}
    >
      {texto}
    </span>
  );
}
