import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi.js";
import { Cargando, ErrorMensaje } from "../components/Estado.jsx";

function Puntos({ puntos }) {
  return (
    <ul className="mt-2 space-y-2">
      {puntos.map((p, i) => (
        <li key={i} className="rounded-md border bg-white px-4 py-3">
          <p>{p.descripcion}</p>
          <Link
            to={`/huesos/${p.hueso.id}`}
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            {p.hueso.nombre} →
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function DetalleMusculo() {
  const { id } = useParams();
  const { datos: musculo, error, cargando } = useApi(`musculos/${id}`);

  if (cargando) return <Cargando />;
  if (error) return <ErrorMensaje mensaje={error} />;

  return (
    <article>
      <Link to="/musculos" className="text-sm text-slate-500 hover:underline">
        ← Músculos
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{musculo.nombre}</h1>
      <p className="text-slate-500 capitalize">Región: {musculo.region}</p>

      <h2 className="mt-8 text-xl font-semibold">Origen</h2>
      <Puntos puntos={musculo.origen} />

      <h2 className="mt-8 text-xl font-semibold">Inserción</h2>
      <Puntos puntos={musculo.insercion} />

      <h2 className="mt-8 text-xl font-semibold">Función</h2>
      <p className="mt-2">{musculo.funcion}</p>
    </article>
  );
}