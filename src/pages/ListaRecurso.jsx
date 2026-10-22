import { useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi.js";
import { Cargando, ErrorMensaje } from "../components/Estado.jsx";

// Quita tildes y pasa a minúsculas, para que "biceps" encuentre "Bíceps"
const normalizar = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function ListaRecurso({ recurso, titulo }) {
  const { datos, error, cargando } = useApi(recurso);
  const [busqueda, setBusqueda] = useState("");

  if (cargando) return <Cargando />;
  if (error) return <ErrorMensaje mensaje={error} />;

  const filtrados = datos.results.filter((item) =>
    normalizar(item.nombre).includes(normalizar(busqueda))
  );

  return (
    <div>
      <h1 className="text-3xl font-bold">{titulo}</h1>
      <input
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder={`Buscar en ${titulo.toLowerCase()}…`}
        className="mt-4 w-full rounded-md border border-slate-300 bg-white px-3 py-2"
      />
      <p className="mt-2 text-sm text-slate-500">{filtrados.length} resultados</p>

      <ul className="mt-4 divide-y rounded-xl border bg-white">
        {filtrados.map((item) => (
          <li key={item.id}>
            <Link
              to={`/${recurso}/${item.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
            >
              <span className="font-medium">{item.nombre}</span>
              <span className="text-sm capitalize text-slate-500">{item.region}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}