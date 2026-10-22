import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Inicio from "./pages/Inicio.jsx";
import ListaRecurso from "./pages/ListaRecurso.jsx";
import DetalleMusculo from "./pages/DetalleMusculo.jsx";
import DetalleHueso from "./pages/DetalleHueso.jsx";
import NoEncontrada from "./pages/NoEncontrada.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route
          path="musculos"
          element={<ListaRecurso key="musculos" recurso="musculos" titulo="Músculos" />}
        />
        <Route path="musculos/:id" element={<DetalleMusculo />} />
        <Route
          path="huesos"
          element={<ListaRecurso key="huesos" recurso="huesos" titulo="Huesos" />}
        />
        <Route path="huesos/:id" element={<DetalleHueso />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}