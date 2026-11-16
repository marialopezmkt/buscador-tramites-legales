import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getArea, getTramite, TRAMITES, type AreaId } from "@/lib/eba/catalogo";
import { PRIMERA_CONSULTA } from "@/lib/eba/catalogo";
import type { Pedido as PedidoTipo } from "@/lib/eba/pedidos";
import {
  validarNombre,
  validarCorreo,
  validarTelefono,
  validarComentario,
  esDuplicado,
} from "@/lib/eba/validacion";
import { usePedidos } from "@/context/PedidosContext";
import { AvisoOrientativo } from "@/components/AvisoOrientativo";
import { EtiquetaLugares } from "@/components/EtiquetaLugares";

interface Errores {
  nombre?: string;
  correo?: string;
  telefono?: string;
  comentario?: string;
}

function nuevoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `pedido-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function Pedido() {
  const { areaId = "familia" } = useParams<{ areaId: AreaId }>();
  const [params] = useSearchParams();
  const { pedidos, semana, resumen, agregarPedido } = usePedidos();

  const area = getArea(areaId);
  const resumenArea = resumen[areaId];
  const tramitesDelArea = TRAMITES.filter((t) => t.areaId === areaId);
  const tramitePreseleccionado = getTramite(params.get("tramite") ?? "");

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tramiteId, setTramiteId] = useState(tramitePreseleccionado?.id ?? "");
  const [comentario, setComentario] = useState("");

  const [errores, setErrores] = useState<Errores>({});
  const [avisoDuplicado, setAvisoDuplicado] = useState(false);
  const [avisoFalloGuardado, setAvisoFalloGuardado] = useState(false);
  const [confirmado, setConfirmado] = useState<PedidoTipo | null>(null);

  function validarTodo(): Errores {
    const nuevos: Errores = {
      nombre: validarNombre(nombre) ?? undefined,
      correo: validarCorreo(correo) ?? undefined,
      telefono: validarTelefono(telefono) ?? undefined,
      comentario: validarComentario(comentario) ?? undefined,
    };
    return nuevos;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAvisoDuplicado(false);
    setAvisoFalloGuardado(false);

    const nuevosErrores = validarTodo();
    setErrores(nuevosErrores);
    if (Object.values(nuevosErrores).some(Boolean)) return;

    // El área puede haberse llenado mientras se completaba el formulario.
    if (!resumenArea.puedePedir) return;

    if (esDuplicado(pedidos, correo, areaId, semana)) {
      setAvisoDuplicado(true);
      return;
    }

    const pedido: PedidoTipo = {
      id: nuevoId(),
      semana,
      areaId,
      tramiteId: tramiteId || null,
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      telefono: telefono.trim(),
      comentario: comentario.trim(),
      estado: "Pedido",
      creadoEn: new Date().toISOString(),
    };

    const ok = agregarPedido(pedido);
    if (!ok) {
      setAvisoFalloGuardado(true);
      return;
    }
    setConfirmado(pedido);
  }

  if (confirmado) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <div className="rounded-xl border border-[var(--color-tinta)]/12 bg-white px-6 py-8 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-[var(--color-gris)] uppercase">
            {area.nombre}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--color-tinta)]">
            Pedido recibido
          </h1>
          <p className="mt-3 text-[var(--color-casi-negro)]">
            Apartamos un lugar para tu primera consulta ({PRIMERA_CONSULTA.duracion}, {PRIMERA_CONSULTA.precio})
            dentro de la franja de {area.nombre.toLowerCase()} ({area.franja.toLowerCase()}).
          </p>
          <p className="mt-2 text-sm text-[var(--color-gris)]">
            Te escribimos a {confirmado.correo} para confirmar el horario dentro de esa franja.
          </p>
          <p className="mt-1 text-xs text-[var(--color-gris)]">Número de pedido: {confirmado.id}</p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-[var(--color-tinta)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Volver al buscador
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-tinta)] hover:underline">
        ← Volver al buscador
      </Link>

      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-tinta)]/12 bg-white shadow-sm">
        <div className="bg-[var(--color-tinta)]/5 px-5 py-2">
          <span className="text-xs font-semibold tracking-wide text-[var(--color-tinta)] uppercase">
            {area.nombre}
          </span>
        </div>

        <div className="px-5 py-5">
          <h1 className="text-xl font-semibold text-[var(--color-tinta)]">Pedido de primera consulta</h1>
          <p className="mt-1 text-sm text-[var(--color-gris)]">
            {PRIMERA_CONSULTA.duracion}, {PRIMERA_CONSULTA.precio}. Franja de {area.nombre.toLowerCase()}:{" "}
            {area.franja.toLowerCase()}. No se asigna día ni hora: apartamos tu lugar en la semana y te
            escribimos para coordinar.
          </p>

          <div className="mt-3">
            <EtiquetaLugares resumen={resumenArea} />
          </div>

          {!resumenArea.puedePedir ? (
            <p className="mt-4 rounded-lg bg-[var(--color-gris)]/10 px-3 py-2 text-sm text-[var(--color-gris)]">
              Esta área se quedó sin lugares para esta semana mientras completabas el formulario. Volvé a
              intentar la semana que viene.
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
              <Campo
                label="Nombre y apellido"
                value={nombre}
                onChange={setNombre}
                error={errores.nombre}
                autoComplete="name"
              />
              <Campo
                label="Correo electrónico"
                value={correo}
                onChange={setCorreo}
                error={errores.correo}
                type="email"
                autoComplete="email"
              />
              <Campo
                label="Teléfono"
                value={telefono}
                onChange={setTelefono}
                error={errores.telefono}
                type="tel"
                autoComplete="tel"
              />

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-[var(--color-casi-negro)]">
                  Trámite de interés <span className="text-[var(--color-gris)] font-normal">(opcional)</span>
                </span>
                <select
                  value={tramiteId}
                  onChange={(e) => setTramiteId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-tinta)]/20 bg-white px-3 py-2.5 text-[var(--color-casi-negro)] outline-none focus:border-[var(--color-tinta)]"
                >
                  <option value="">Prefiero no especificar</option>
                  {tramitesDelArea.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-[var(--color-casi-negro)]">
                  Comentario <span className="text-[var(--color-gris)] font-normal">(opcional)</span>
                </span>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={3}
                  maxLength={300}
                  className="w-full rounded-lg border border-[var(--color-tinta)]/20 bg-white px-3 py-2.5 text-[var(--color-casi-negro)] outline-none focus:border-[var(--color-tinta)]"
                />
                {errores.comentario && (
                  <p className="mt-1 text-sm text-[var(--color-terracota)]">{errores.comentario}</p>
                )}
              </label>

              <div className="pt-2">
                <AvisoOrientativo />
              </div>

              {avisoDuplicado && (
                <p className="rounded-lg bg-[var(--color-terracota)]/10 px-3 py-2 text-sm text-[var(--color-terracota)]">
                  Ya tenés un lugar apartado esta semana en {area.nombre.toLowerCase()} con ese correo. No
                  hace falta pedir otro.
                </p>
              )}
              {avisoFalloGuardado && (
                <p className="rounded-lg bg-[var(--color-terracota)]/10 px-3 py-2 text-sm text-[var(--color-terracota)]">
                  No pudimos guardar el pedido en este navegador. Lo que escribiste sigue acá: probá de
                  nuevo, o desde otro navegador.
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-[var(--color-tinta)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Pedir mi lugar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-[var(--color-casi-negro)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-[var(--color-casi-negro)] outline-none ${
          error ? "border-[var(--color-terracota)]" : "border-[var(--color-tinta)]/20 focus:border-[var(--color-tinta)]"
        }`}
      />
      {error && <p className="mt-1 text-sm text-[var(--color-terracota)]">{error}</p>}
    </label>
  );
}
