import { describe, it, expect, beforeEach } from "vitest";
import { buscarTramites, normalizar } from "@/lib/eba/busqueda";
import { resumenArea, resumenTodas } from "@/lib/eba/lugares";
import { iniciarAlmacen, guardarPedidos, CLAVES } from "@/lib/eba/almacen";
import { semanaISO } from "@/lib/eba/semana";
import { TRAMITES } from "@/lib/eba/catalogo";
import type { Pedido } from "@/lib/eba/pedidos";

const ids = (ts: { id: string }[]) => ts.map((t) => t.id);

describe("catálogo", () => {
  it("tiene 10 trámites", () => expect(TRAMITES).toHaveLength(10));
});

describe("buscador", () => {
  it("'me echaron' trae solo Reclamo por despido (laboral), no Desalojo", () => {
    expect(ids(buscarTramites("me echaron"))).toEqual(["reclamo-despido"]);
  });
  it("ignora tildes, mayúsculas y espacios en los extremos", () => {
    expect(ids(buscarTramites("  ME ECHARON  "))).toEqual(["reclamo-despido"]);
    expect(ids(buscarTramites("indemnizacion"))).toEqual(["reclamo-despido"]);
    expect(normalizar(" Régimen ")).toBe("regimen");
  });
  it("'no me pasa plata' trae Cuota alimentaria", () => {
    expect(ids(buscarTramites("no me pasa plata"))).toEqual(["cuota-alimentaria"]);
  });
  it("chip + texto: solo trámites que cumplen las dos condiciones", () => {
    expect(ids(buscarTramites("inquilino"))).toEqual(["revision-contrato-alquiler", "desalojo-falta-pago"]);
    expect(buscarTramites("inquilino", ["laboral"])).toEqual([]);
    expect(ids(buscarTramites("hijos", ["familia"]))).toEqual(["cuota-alimentaria", "regimen-comunicacion"]);
    expect(buscarTramites("hijos", ["laboral"])).toEqual([]);
  });
  it("chips combinables entre sí; sin texto ni chips trae los 10", () => {
    expect(buscarTramites("", ["familia", "laboral"])).toHaveLength(6);
    expect(buscarTramites("")).toHaveLength(10);
  });
});

describe("semilla y lugares", () => {
  beforeEach(() => localStorage.clear());
  const ahora = new Date("2026-11-12T12:00:00Z");

  it("Laboral queda en 0 y 'Semana completa'; Familia 4; Sucesiones 2 'Últimos lugares'", () => {
    const { pedidos, semana } = iniciarAlmacen(localStorage, ahora);
    const r = resumenTodas(pedidos, semana);
    expect(r.laboral).toMatchObject({ libres: 0, etiqueta: "Semana completa", puedePedir: false });
    expect(r.familia).toMatchObject({ libres: 4, estado: "disponible", puedePedir: true });
    expect(r["sucesiones-vivienda"]).toMatchObject({ libres: 2, etiqueta: "Últimos lugares", puedePedir: true });
  });

  it("con 3 libres no es 'Últimos lugares'; con 2 o 1 sí", () => {
    const { pedidos, semana } = iniciarAlmacen(localStorage, ahora);
    const base = pedidos[0]!;
    const extra = (n: number): Pedido[] =>
      Array.from({ length: n }, (_, i) => ({ ...base, id: `x${i}`, areaId: "familia" }));
    expect(resumenArea("familia", [...pedidos, ...extra(1)], semana).etiqueta).not.toBe("Últimos lugares");
    expect(resumenArea("familia", [...pedidos, ...extra(2)], semana).etiqueta).toBe("Últimos lugares");
    expect(resumenArea("familia", [...pedidos, ...extra(3)], semana).etiqueta).toBe("Últimos lugares");
  });

  it("un pedido resta al área completa, sin importar el trámite", () => {
    const { pedidos, semana } = iniciarAlmacen(localStorage, ahora);
    const nuevo = { ...pedidos[0]!, id: "n", areaId: "familia" as const, tramiteId: null };
    expect(resumenArea("familia", [...pedidos, nuevo], semana).libres).toBe(3);
  });

  it("la semilla no se vuelve a cargar si la lista guardada está vacía", () => {
    localStorage.setItem(CLAVES.pedidos, "[]");
    expect(iniciarAlmacen(localStorage, ahora).pedidos).toEqual([]);
  });

  it("en una semana nueva los lugares vuelven al tope y los pedidos viejos se conservan", () => {
    iniciarAlmacen(localStorage, ahora);
    const despues = new Date("2026-11-19T12:00:00Z");
    const { pedidos, semana } = iniciarAlmacen(localStorage, despues);
    expect(pedidos).toHaveLength(13);
    expect(localStorage.getItem(CLAVES.semana)).toBe(semana);
    expect(resumenArea("laboral", pedidos, semana).libres).toBe(8);
  });

  it("semana ISO con hora argentina: domingo 23 h AR sigue en la misma semana", () => {
    expect(semanaISO(new Date("2026-11-16T02:00:00Z"))).toBe("2026-W46"); // dom 15, 23 h AR
    expect(semanaISO(new Date("2026-11-16T03:00:00Z"))).toBe("2026-W47"); // lun 16, 0 h AR
  });

  it("guardarPedidos persiste la lista completa", () => {
    const { pedidos } = iniciarAlmacen(localStorage, ahora);
    const nuevo = { ...pedidos[0]!, id: "guardado-1" };
    guardarPedidos([...pedidos, nuevo], localStorage);
    const relectura = JSON.parse(localStorage.getItem(CLAVES.pedidos)!);
    expect(relectura).toHaveLength(pedidos.length + 1);
  });
});
