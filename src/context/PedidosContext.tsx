import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { iniciarAlmacen, guardarPedidos } from "@/lib/eba/almacen";
import type { Pedido } from "@/lib/eba/pedidos";
import { resumenTodas, type ResumenArea } from "@/lib/eba/lugares";
import type { AreaId } from "@/lib/eba/catalogo";

interface PedidosContextValue {
  pedidos: Pedido[];
  semana: string;
  resumen: Record<AreaId, ResumenArea>;
  /**
   * Agrega un pedido: guarda primero en localStorage y, solo si eso funciona,
   * actualiza los lugares al instante (sin recargar). Si falla, no se pierde lo
   * escrito ni se altera ningún estado: devuelve false para que la pantalla lo avise.
   */
  agregarPedido: (pedido: Pedido) => boolean;
}

const PedidosContext = createContext<PedidosContextValue | null>(null);

export function PedidosProvider({
  children,
  ahora,
}: {
  children: ReactNode;
  /** Solo para pruebas: fija la fecha con la que se calcula la semana al iniciar. */
  ahora?: Date;
}) {
  const [estado, setEstado] = useState<{ pedidos: Pedido[]; semana: string } | null>(null);

  // Se lee localStorage una sola vez, al montar, en el navegador.
  useEffect(() => {
    setEstado(iniciarAlmacen(window.localStorage, ahora));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!estado) return null;

  function agregarPedido(pedido: Pedido): boolean {
    const nuevos = [...estado.pedidos, pedido];
    const ok = guardarPedidos(nuevos);
    if (ok) setEstado({ ...estado, pedidos: nuevos });
    return ok;
  }

  const resumen = resumenTodas(estado.pedidos, estado.semana);

  return (
    <PedidosContext.Provider value={{ pedidos: estado.pedidos, semana: estado.semana, resumen, agregarPedido }}>
      {children}
    </PedidosContext.Provider>
  );
}

export function usePedidos(): PedidosContextValue {
  const ctx = useContext(PedidosContext);
  if (!ctx) throw new Error("usePedidos debe usarse dentro de <PedidosProvider>");
  return ctx;
}
