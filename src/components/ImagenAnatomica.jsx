export default function ImagenAnatomica({ imagen, alt }) {
  // Si el recurso no tiene imagen, no se dibuja nada
  if (!imagen) return null;

  return (
    <figure className="mt-6 overflow-hidden rounded-xl border bg-white p-4">
      <img
        src={imagen.url}
        alt={alt}
        loading="lazy"
        className="mx-auto max-h-96 object-contain"
      />
      <figcaption className="mt-3 text-xs text-slate-500">
        Imagen: {imagen.autor} · {imagen.licencia} ·{" "}
        <a href={imagen.fuente} target="_blank" rel="noreferrer" className="underline">
          fuente
        </a>
      </figcaption>
    </figure>
  );
}