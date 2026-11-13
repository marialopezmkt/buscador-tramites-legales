// Semana ISO (lunes a domingo) calculada con la hora de Argentina (UTC-3, sin horario de verano).
const OFFSET_AR_MS = -3 * 60 * 60 * 1000;

export function semanaISO(fecha: Date = new Date()): string {
  const local = new Date(fecha.getTime() + OFFSET_AR_MS);
  const d = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()));
  const dia = d.getUTCDay() || 7; // lunes=1 … domingo=7
  d.setUTCDate(d.getUTCDate() + 4 - dia); // jueves de esa semana define el año ISO
  const anio = d.getUTCFullYear();
  const inicio = Date.UTC(anio, 0, 1);
  const numero = Math.ceil(((d.getTime() - inicio) / 86400000 + 1) / 7);
  return `${anio}-W${String(numero).padStart(2, "0")}`;
}
