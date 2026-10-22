import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi.js";
import { Cargando, ErrorMensaje } from "../components/Estado.jsx";
import ImagenAnatomica from "../components/ImagenAnatomica.jsx";

function ListaMusculos({ musculos }) {
  if (musculos.length === 0) {
    return <p className="mt-2 text-slate-500">Sin registros todavía.</p>;
  }
  return (
    <ul className="mt-2 divide-y rounded-xl border bg-white">
      {musculos.map((m) => (
        <li key={m.id}>
          <Link to={`/musculos/${m.id}`} className="block px-4 py-3 hover:bg-slate-50">
            {m.nombre}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function DetalleHueso() {
  const { id } = useParams();
  const { datos: hueso, error, cargando } = useApi(`huesos/${id}`);

  if (cargando) return <Cargando />;
  if (error) return <ErrorMensaje mensaje={error} />;

  return (
    <article>
      <Link to="/huesos" className="text-sm text-slate-500 hover:underline">
        ← Huesos
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{hueso.nombre}</h1>
      <p className="text-slate-500 capitalize">
        Región: {hueso.region} · Tipo: {hueso.tipo}
      </p>
      <p className="mt-4">{hueso.descripcion}</p>

      <ImagenAnatomica imagen={hueso.imagen} alt={`Ilustración de ${hueso.nombre}`} />

      <h2 className="mt-8 text-xl font-semibold">Músculos que se originan aquí</h2>
      <ListaMusculos musculos={hueso.musculos_origen} />

      <h2 className="mt-8 text-xl font-semibold">Músculos que se insertan aquí</h2>
      <ListaMusculos musculos={hueso.musculos_insercion} />
    </article>
  );
}