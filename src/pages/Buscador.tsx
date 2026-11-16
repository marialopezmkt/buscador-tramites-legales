import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AREAS, type AreaId } from "@/lib/eba/catalogo";
import { buscarTramites } from "@/lib/eba/busqueda";
import { ChipArea } from "@/components/ChipArea";
import { TarjetaTramite } from "@/components/TarjetaTramite";
import { usePedidos } from "@/context/PedidosContext";

const EJEMPLOS = ["me echaron", "no me pasa plata", "herencia", "falleció"];

export function Buscador() {
  const [params, setParams] = useSearchParams();
  const { resumen } = usePedidos();

  const texto = params.get("q") ?? "";
  const areasActivas = (params.get("areas")?.split(",").filter(Boolean) ?? []) as AreaId[];

  const resultados = useMemo(
    () => buscarTramites(texto, areasActivas),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [texto, areasActivas.join(",")],
  );

  function actualizar(nuevoTexto: string, nuevasAreas: AreaId[]) {
    const next = new URLSearchParams();
    if (nuevoTexto) next.set("q", nuevoTexto);
    if (nuevasAreas.length) next.set("areas", nuevasAreas.join(","));
    setParams(next, { replace: true });
  }

  // Selección única: clickear un área la deja como la única activa; volver a
  // clickear la misma área la suelta y muestra todas de nuevo.
  function alternarArea(id: AreaId) {
    const activa = areasActivas.includes(id);
    const nuevas = activa ? [] : [id];
    actualizar(texto, nuevas);
  }

  function limpiar() {
    actualizar("", []);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <header className="mb-6 text-center">
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Contanos qué te pasa, con tus palabras</h1>
        <p className="mt-2 text-sm text-[var(--color-gris)]">
          No hace falta que sepas de derecho. Escribí lo que te pasó y te mostramos el trámite que corresponde.
        </p>
      </header>

      <div className="sticky top-0 z-10 -mx-4 bg-[var(--color-crema)]/95 px-4 pb-3 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-none">
        <div className="relative">
          <button
            type="button"
            onClick={() => actualizar(texto, areasActivas)}
            aria-label="Buscar"
            tabIndex={-1}
            className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--color-gris)]"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
              <circle cx="9" cy="9" r="6.25" />
              <path d="M17 17l-3.8-3.8" strokeLinecap="round" />
            </svg>
          </button>
          <input
            type="text"
            value={texto}
            onChange={(e) => actualizar(e.target.value, areasActivas)}
            placeholder={`Por ejemplo: "${EJEMPLOS[0]}"`}
            aria-label="Buscar trámite"
            className="w-full rounded-xl border border-[var(--color-tinta)]/20 bg-white py-3 pl-10 pr-10 text-base text-[var(--color-casi-negro)] shadow-sm outline-none focus:border-[var(--color-tinta)]"
          />
          {texto && (
            <button
              type="button"
              onClick={() => actualizar("", areasActivas)}
              aria-label="Borrar búsqueda"
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--color-gris)] hover:text-[var(--color-tinta)]"
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {AREAS.map((area) => (
            <ChipArea
              key={area.id}
              area={area}
              activo={areasActivas.includes(area.id)}
              onToggle={() => alternarArea(area.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {resultados.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-gris)]/30 bg-white/60 px-4 py-8 text-center">
            <p className="text-[var(--color-casi-negro)]">
              No encontramos un trámite con esas palabras. Probá describirlo de otra forma, por ejemplo:{" "}
              {EJEMPLOS.slice(1).map((e) => `"${e}"`).join(", ")}.
            </p>
            <button
              type="button"
              onClick={limpiar}
              className="mt-4 rounded-full border border-[var(--color-tinta)]/25 px-4 py-1.5 text-sm font-medium text-[var(--color-tinta)] hover:bg-[var(--color-tinta)]/5"
            >
              Borrar búsqueda y filtros
            </button>
          </div>
        ) : (
          resultados.map((tramite) => (
            <TarjetaTramite
              key={tramite.id}
              tramite={tramite}
              resumen={resumen[tramite.areaId]}
              to={`/tramite/${tramite.id}?${params.toString()}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
