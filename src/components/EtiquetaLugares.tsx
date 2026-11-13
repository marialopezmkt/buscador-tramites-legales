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

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${estilos[resumen.estado]}`}
    >
      {resumen.etiqueta}
    </span>
  );
}
