export function Cargando() {
  return <p className="text-slate-500">Cargando…</p>;
}

export function ErrorMensaje({ mensaje }) {
  return <p className="rounded-md bg-red-50 p-4 text-red-700">{mensaje}</p>;
}