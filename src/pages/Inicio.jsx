import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi.js";

function Tarjeta({ to, titulo, texto, total }) {
  return (
    <Link
      to={to}
      className="block rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <h2 className="text-xl font-semibold">{titulo}</h2>
      <p className="mt-1 text-slate-600">{texto}</p>
      {total !== undefined && (
        <p className="mt-4 text-sm text-slate-500">{total} registros</p>
      )}
    </Link>
  );
}

export default function Inicio() {
  const musculos = useApi("musculos");
  const huesos = useApi("huesos");

  return (
    <div>
      <h1 className="text-3xl font-bold">Atlas de Anatomía</h1>
      <p className="mt-2 text-slate-600">
        Consulta músculos y huesos del cuerpo humano, con origen, inserción y función.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Tarjeta
          to="/musculos"
          titulo="Músculos"
          texto="Origen, inserción y función."
          total={musculos.datos?.count}
        />
        <Tarjeta
          to="/huesos"
          titulo="Huesos"
          texto="Región, tipo y músculos relacionados."
          total={huesos.datos?.count}
        />
      </div>
    </div>
  );
}