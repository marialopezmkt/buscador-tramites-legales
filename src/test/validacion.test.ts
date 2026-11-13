import { describe, it, expect } from "vitest";
import {
  validarNombre,
  validarCorreo,
  validarTelefono,
  validarComentario,
  esDuplicado,
  normalizarCorreo,
} from "@/lib/eba/validacion";
import type { Pedido } from "@/lib/eba/pedidos";

describe("validarNombre", () => {
  it("rechaza vacío y un solo nombre; acepta nombre y apellido", () => {
    expect(validarNombre("")).not.toBeNull();
    expect(validarNombre("Juan")).not.toBeNull();
    expect(validarNombre("Juan Pérez")).toBeNull();
  });
});

describe("validarCorreo", () => {
  it("rechaza vacío y formato inválido; acepta uno válido", () => {
    expect(validarCorreo("")).not.toBeNull();
    expect(validarCorreo("no-es-correo")).not.toBeNull();
    expect(validarCorreo("ana@example.com")).toBeNull();
  });
});

describe("validarTelefono", () => {
  it("rechaza corto, largo y con letras; acepta 8 a 15 dígitos con separadores", () => {
    expect(validarTelefono("123")).not.toBeNull();
    expect(validarTelefono("1".repeat(16))).not.toBeNull();
    expect(validarTelefono("11-abcd-1234")).not.toBeNull();
    expect(validarTelefono("11 4562-3381")).toBeNull();
  });
});

describe("validarComentario", () => {
  it("acepta vacío; rechaza más de 300 caracteres", () => {
    expect(validarComentario("")).toBeNull();
    expect(validarComentario("x".repeat(301))).not.toBeNull();
    expect(validarComentario("x".repeat(300))).toBeNull();
  });
});

describe("duplicados", () => {
  const base: Pedido = {
    id: "1", semana: "2026-W46", areaId: "familia", tramiteId: null,
    nombre: "Ana Paz", correo: "ANA@EXAMPLE.COM ", telefono: "11 1111-1111",
    comentario: "", estado: "Pedido", creadoEn: "2026-11-10T00:00:00.000Z",
  };

  it("normaliza espacios y mayúsculas al comparar", () => {
    expect(normalizarCorreo(" Ana@Example.com ")).toBe("ana@example.com");
  });

  it("mismo correo + área + semana es duplicado, sin importar el trámite", () => {
    expect(esDuplicado([base], " ana@example.com", "familia", "2026-W46")).toBe(true);
  });

  it("distinta área o distinta semana no es duplicado", () => {
    expect(esDuplicado([base], "ana@example.com", "laboral", "2026-W46")).toBe(false);
    expect(esDuplicado([base], "ana@example.com", "familia", "2026-W47")).toBe(false);
  });

  it("distinto correo no es duplicado", () => {
    expect(esDuplicado([base], "otra@example.com", "familia", "2026-W46")).toBe(false);
  });
});
