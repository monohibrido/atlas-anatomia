import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Página no encontrada</h1>
      <Link to="/" className="mt-4 inline-block text-blue-700 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}