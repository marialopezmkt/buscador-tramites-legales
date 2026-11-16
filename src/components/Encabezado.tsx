import { Link } from "react-router-dom";

/**
 * Barra fija arriba de toda la app: tocar el nombre del estudio lleva siempre
 * al buscador (página principal), desde cualquier sección.
 */
export function Encabezado() {
  return (
    <div className="sticky top-0 z-20 border-b border-[var(--color-tinta)]/10 bg-[var(--color-crema)]/95 backdrop-blur">
      <div className="mx-auto max-w-2xl px-4 py-2.5 text-center">
        <Link
          to="/"
          className="text-xs font-semibold tracking-wide text-[var(--color-tinta)] uppercase hover:underline"
        >
          Estudio Bellocq Arrizabalaga
        </Link>
      </div>
    </div>
  );
}
