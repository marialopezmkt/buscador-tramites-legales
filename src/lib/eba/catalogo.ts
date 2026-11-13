// Catálogo fijo del estudio. Datos de prueba y orientativos: no cambian en uso.

export type AreaId = "familia" | "laboral" | "sucesiones-vivienda";

export interface Area {
  id: AreaId;
  nombre: string;
  topeSemanal: number;
  franja: string;
}

export interface Tramite {
  id: string;
  areaId: AreaId;
  nombre: string;
  plazo: string;
  honorario: string;
  palabrasClave: string[];
  papeles: string[];
}

export const PRIMERA_CONSULTA = { duracion: "30 minutos", precio: "$25.000" } as const;

export const AREAS: Area[] = [
  { id: "familia", nombre: "Familia", topeSemanal: 6, franja: "Martes y jueves de 16 a 19" },
  { id: "laboral", nombre: "Laboral", topeSemanal: 8, franja: "Lunes y miércoles de 9 a 12" },
  { id: "sucesiones-vivienda", nombre: "Sucesiones y vivienda", topeSemanal: 5, franja: "Viernes de 10 a 13" },
];

export const TRAMITES: Tramite[] = [
  {
    id: "divorcio-comun-acuerdo", areaId: "familia", nombre: "Divorcio de común acuerdo",
    plazo: "4 a 6 meses", honorario: "$480.000",
    palabrasClave: ["separación", "divorciarme", "casados"],
    papeles: ["DNI de los dos", "Acta de matrimonio", "Actas de nacimiento de los hijos, si hay", "Datos de los bienes en común", "Domicilio actual de cada uno"],
  },
  {
    id: "cuota-alimentaria", areaId: "familia", nombre: "Cuota alimentaria",
    plazo: "6 a 12 meses", honorario: "$350.000",
    palabrasClave: ["alimentos", "hijos", "no me pasa plata"],
    papeles: ["DNI", "Acta de nacimiento de cada hijo", "Comprobantes de gastos (colegio, salud, alquiler)", "Lo que sepas del trabajo o los ingresos del otro progenitor", "Un CBU a tu nombre"],
  },
  {
    id: "regimen-comunicacion", areaId: "familia", nombre: "Régimen de comunicación",
    plazo: "3 a 8 meses", honorario: "$320.000",
    palabrasClave: ["ver a mis hijos", "visitas", "tenencia"],
    papeles: ["DNI", "Acta de nacimiento de cada hijo", "Datos de contacto del otro progenitor", "Acuerdos anteriores, si los hubo", "Constancia escolar"],
  },
  {
    id: "reclamo-despido", areaId: "laboral", nombre: "Reclamo por despido",
    plazo: "2 a 10 meses", honorario: "20 % de lo cobrado",
    palabrasClave: ["me echaron", "despido", "indemnización"],
    papeles: ["DNI y CUIL", "Recibos de sueldo de los últimos seis meses", "El telegrama o la carta documento que te mandaron", "Fecha de ingreso y de salida", "Certificado de trabajo, si te lo dieron"],
  },
  {
    id: "telegrama-laboral", areaId: "laboral", nombre: "Telegrama laboral",
    plazo: "3 días", honorario: "$60.000",
    palabrasClave: ["carta documento", "intimar", "patrón"],
    papeles: ["DNI y CUIL", "Último recibo de sueldo", "Nombre, CUIT y domicilio del empleador", "Qué pasó y en qué fechas, anotado"],
  },
  {
    id: "accidente-trabajo", areaId: "laboral", nombre: "Accidente de trabajo",
    plazo: "6 a 18 meses", honorario: "20 % de lo cobrado",
    palabrasClave: ["ART", "me lastimé", "lesión"],
    papeles: ["DNI y CUIL", "Denuncia ante la ART", "Estudios y certificados médicos", "Recibos de sueldo", "Constancia de los días de licencia"],
  },
  {
    id: "sucesion-sin-testamento", areaId: "sucesiones-vivienda", nombre: "Sucesión sin testamento",
    plazo: "10 a 18 meses", honorario: "$900.000",
    palabrasClave: ["herencia", "falleció", "casa de mis padres"],
    papeles: ["DNI", "Partida de defunción", "Actas que prueben el vínculo", "Títulos o datos de los bienes", "Deudas conocidas, si las hay"],
  },
  {
    id: "revision-contrato-alquiler", areaId: "sucesiones-vivienda", nombre: "Revisión de contrato de alquiler",
    plazo: "2 días", honorario: "$85.000",
    palabrasClave: ["inquilino", "firmar", "garantía"],
    papeles: ["DNI", "El contrato que te pasaron para firmar", "Datos de la garantía propuesta", "Datos del inmueble"],
  },
  {
    id: "devolucion-deposito", areaId: "sucesiones-vivienda", nombre: "Devolución de depósito",
    plazo: "2 a 5 meses", honorario: "$150.000",
    palabrasClave: ["no me devuelven", "dueño", "mudanza"],
    papeles: ["DNI", "Contrato firmado", "Comprobante del depósito entregado", "Fotos del estado en que devolviste el inmueble", "Últimos pagos de servicios y expensas", "Mensajes con el dueño o la inmobiliaria"],
  },
  {
    id: "desalojo-falta-pago", areaId: "sucesiones-vivienda", nombre: "Desalojo por falta de pago",
    plazo: "8 a 14 meses", honorario: "$620.000",
    palabrasClave: ["no me paga", "inquilino moroso", "echar"],
    papeles: ["DNI", "Contrato de alquiler", "Comprobantes de los pagos recibidos y de los meses adeudados", "Intimaciones enviadas", "Escritura o constancia de que el inmueble es tuyo"],
  },
];

export function getArea(id: AreaId): Area {
  const area = AREAS.find((a) => a.id === id);
  if (!area) throw new Error(`Área desconocida: ${id}`);
  return area;
}

export function getTramite(id: string): Tramite | undefined {
  return TRAMITES.find((t) => t.id === id);
}
