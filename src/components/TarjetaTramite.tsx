import { Link } from "react-router-dom";
import type { Tramite } from "@/lib/eba/catalogo";
import { getArea } from "@/lib/eba/catalogo";
import { EtiquetaLugares } from "./EtiquetaLugares";
import type { ResumenArea } from "@/lib/eba/lugares";

/** Tarjeta con aire de índice de carpeta: una pestaña superior rotula el área de un vistazo. */
export function TarjetaTramite({
  tramite,
  resumen,
  to,
}: {
  tramite: Tramite;
  resumen: ResumenArea;
  to: string;
}) {
  const area = getArea(tramite.areaId);

  return (
    <Link
      to={to}
      className="group block overflow-hidden rounded-xl border border-[var(--color-tinta)]/12 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between bg-[var(--color-tinta)]/5 px-4 py-1.5">
        <span className="text-xs font-semibold tracking-wide text-[var(--color-tinta)] uppercase">
          {area.nombre}
        </span>
      </div>
      <div className="px-4 py-3.5">
        <h3 className="text-lg leading-snug font-semibold text-[var(--color-tinta)] group-hover:underline">
          {tramite.nombre}
        </h3>
        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-casi-negro)]">
          <div>
            <dt className="inline text-[var(--color-gris)]">Plazo: </dt>
            <dd className="inline">{tramite.plazo}</dd>
          </div>
          <div>
            <dt className="inline text-[var(--color-gris)]">Honorario orientativo: </dt>
            <dd className="inline">{tramite.honorario}</dd>
          </div>
        </dl>
        <div className="mt-3">
          <EtiquetaLugares resumen={resumen} />
        </div>
      </div>
    </Link>
  );
}
