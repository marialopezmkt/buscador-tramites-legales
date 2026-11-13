import type { Area } from "@/lib/eba/catalogo";

export function ChipArea({
  area,
  activo,
  onToggle,
}: {
  area: Area;
  activo: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={activo}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        activo
          ? "border-[var(--color-tinta)] bg-[var(--color-tinta)] text-white"
          : "border-[var(--color-tinta)]/25 bg-white text-[var(--color-tinta)] hover:bg-[var(--color-tinta)]/5"
      }`}
    >
      {area.nombre}
    </button>
  );
}
