const BASE = "/api/v1";

// Acepta "musculos", "musculos/biceps-braquial" o una url completa como "/api/v1/huesos/escapula"
export async function obtener(ruta) {
    const path = ruta.startsWith("/") ? ruta : `${BASE}/${ruta}`;
    const respuesta = await fetch(`${path}.json`);

    const tipo = respuesta.headers.get("content-type") ?? "";
    if (respuesta.status === 404 || !tipo.includes("json")) {
        throw new Error("No se encontró el recurso solicitado.");
    }
    if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status} al consultar la API.`);
    }

    return respuesta.json();
}