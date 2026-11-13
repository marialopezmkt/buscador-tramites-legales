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

  function alternarArea(id: AreaId) {
    const activa = areasActivas.includes(id);
    const nuevas = activa ? areasActivas.filter((a) => a !== id) : [...areasActivas, id];
    actualizar(texto, nuevas);
  }

  function limpiar() {
    actualizar("", []);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <header className="mb-6 text-center">
        <p className="text-xs font-semibold tracking-wide text-[var(--color-gris)] uppercase">
          Estudio Bellocq Arrizabalaga
        </p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Contanos qué te pasa, con tus palabras</h1>
        <p className="mt-2 text-sm text-[var(--color-gris)]">
          No hace falta que sepas de derecho. Escribí lo que te pasó y te mostramos el trámite que corresponde.
        </p>
      </header>

      <div className="sticky top-0 z-10 -mx-4 bg-[var(--color-crema)]/95 px-4 pb-3 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-none">
        <input
          type="text"
          value={texto}
          onChange={(e) => actualizar(e.target.value, areasActivas)}
          placeholder={`Por ejemplo: "${EJEMPLOS[0]}"`}
          aria-label="Buscar trámite"
          className="w-full rounded-xl border border-[var(--color-tinta)]/20 bg-white px-4 py-3 text-base text-[var(--color-casi-negro)] shadow-sm outline-none focus:border-[var(--color-tinta)]"
        />

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
