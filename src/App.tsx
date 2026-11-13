import { Routes, Route } from "react-router-dom";
import { Buscador } from "@/pages/Buscador";
import { Ficha } from "@/pages/Ficha";
import { Pedido } from "@/pages/Pedido";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Buscador />} />
      <Route path="/tramite/:id" element={<Ficha />} />
      <Route path="/consulta/:areaId" element={<Pedido />} />
    </Routes>
  );
}
