import { Link, useLocation, useParams } from "react-router-dom";
import { getTramite, getArea } from "@/lib/eba/catalogo";
import { AvisoOrientativo } from "@/components/AvisoOrientativo";
import { EtiquetaLugares } from "@/components/EtiquetaLugares";
import { usePedidos } from "@/context/PedidosContext";

export function Ficha() {
  const { id = "" } = useParams();
  const location = useLocation();
  const { resumen } = usePedidos();
  const tramite = getTramite(id);

  if (!tramite) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p>No encontramos ese trámite.</p>
        <Link to="/" className="mt-4 inline-block text-[var(--color-tinta)] underline">
          Volver al buscador
        </Link>
      </div>
    );
  }

  const area = getArea(tramite.areaId);
  const resumenArea = resumen[tramite.areaId];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <Link
        to={{ pathname: "/", search: location.search }}
        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-tinta)] hover:underline"
      >
        ← Volver al buscador
      </Link>

      <article className="mt-4 overflow-hidden rounded-xl border border-[var(--color-tinta)]/12 bg-white shadow-sm">
        <div className="bg-[var(--color-tinta)]/5 px-5 py-2">
          <span className="text-xs font-semibold tracking-wide text-[var(--color-tinta)] uppercase">
            {area.nombre}
          </span>
        </div>

        <div className="px-5 py-5">
          <h1 className="text-2xl font-semibold text-[var(--color-tinta)]">{tramite.nombre}</h1>

          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <div>
              <dt className="inline text-[var(--color-gris)]">Plazo estimado: </dt>
              <dd className="inline font-medium">{tramite.plazo}</dd>
            </div>
            <div>
              <dt className="inline text-[var(--color-gris)]">Honorario orientativo: </dt>
              <dd className="inline font-medium">{tramite.honorario}</dd>
            </div>
          </dl>

          <h2 className="mt-5 text-base font-semibold text-[var(--color-tinta)]">
            Papeles que tenés que reunir
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--color-casi-negro)]">
            {tramite.papeles.map((papel) => (
              <li key={papel}>{papel}</li>
            ))}
          </ul>

          <div className="mt-5">
            <AvisoOrientativo />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <EtiquetaLugares resumen={resumenArea} />
            {resumenArea.puedePedir ? (
              <Link
                to={`/consulta/${area.id}?tramite=${tramite.id}`}
                className="rounded-full bg-[var(--color-tinta)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Pedir primera consulta
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-full bg-[var(--color-gris)]/30 px-5 py-2.5 text-sm font-semibold text-[var(--color-gris)]"
              >
                Pedir primera consulta
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
