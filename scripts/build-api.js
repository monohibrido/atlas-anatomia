import { readFile, writeFile, mkdir, rm, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(__dirname, "..");
const DATA = path.join(RAIZ, "data");
const SALIDA = path.join(RAIZ, "public", "api", "v1");
const IMAGENES = path.join(RAIZ, "public", "img");
const BASE = "/api/v1";

const leerJSON = async (archivo) =>
    JSON.parse(await readFile(path.join(DATA, archivo), "utf-8"));

async function escribir(ruta, contenido) {
    const destino = path.join(SALIDA, ruta);
    await mkdir(path.dirname(destino), { recursive: true });
    await writeFile(destino, JSON.stringify(contenido, null, 2), "utf-8");
}

const refHueso = (h) => ({ id: h.id, nombre: h.nombre, url: `${BASE}/huesos/${h.id}` });
const refMusculo = (m) => ({ id: m.id, nombre: m.nombre, url: `${BASE}/musculos/${m.id}` });

// Convierte los datos de la imagen en lo que mostrará la API (con la URL completa)
const refImagen = (tipo, imagen) =>
    imagen
        ? {
            url: `/img/${tipo}/${imagen.archivo}`,
            autor: imagen.autor,
            licencia: imagen.licencia,
            fuente: imagen.fuente,
        }
        : null;

function validarIdsUnicos(lista, tipo) {
    const vistos = new Set();
    for (const item of lista) {
        if (vistos.has(item.id)) {
            throw new Error(`ID duplicado en ${tipo}: "${item.id}"`);
        }
        vistos.add(item.id);
    }
}

// Verifica que la imagen tenga todos sus datos y que el archivo exista
async function validarImagen(tipo, item) {
    if (!item.imagen) return;
    const { archivo, autor, licencia, fuente } = item.imagen;

    if (!archivo || !autor || !licencia || !fuente) {
        throw new Error(
            `La imagen de "${item.id}" debe tener archivo, autor, licencia y fuente.`
        );
    }
    try {
        await access(path.join(IMAGENES, tipo, archivo));
    } catch {
        throw new Error(
            `Falta el archivo de imagen de "${item.id}": public/img/${tipo}/${archivo}`
        );
    }
}

async function main() {
    const musculos = await leerJSON("musculos.json");
    const huesos = await leerJSON("huesos.json");

    validarIdsUnicos(musculos, "músculos");
    validarIdsUnicos(huesos, "huesos");

    for (const m of musculos) await validarImagen("musculos", m);
    for (const h of huesos) await validarImagen("huesos", h);

    const huesosPorId = new Map(huesos.map((h) => [h.id, h]));

    // Músculos: reemplaza el id del hueso por una referencia con URL
    const musculosSalida = musculos.map((m) => {
        const convertir = (puntos, campo) =>
            puntos.map((p) => {
                const hueso = huesosPorId.get(p.hueso);
                if (!hueso) {
                    throw new Error(
                        `El músculo "${m.id}" referencia un hueso que no existe: "${p.hueso}" (campo ${campo})`
                    );
                }
                return { descripcion: p.descripcion, hueso: refHueso(hueso) };
            });

        return {
            ...m,
            imagen: refImagen("musculos", m.imagen),
            origen: convertir(m.origen, "origen"),
            insercion: convertir(m.insercion, "insercion"),
        };
    });

    // Huesos: copia todos sus campos (...h) y agrega la imagen y los músculos relacionados
    const huesosSalida = huesos.map((h) => ({
        ...h,
        imagen: refImagen("huesos", h.imagen),
        musculos_origen: musculos
            .filter((m) => m.origen.some((p) => p.hueso === h.id))
            .map(refMusculo),
        musculos_insercion: musculos
            .filter((m) => m.insercion.some((p) => p.hueso === h.id))
            .map(refMusculo),
    }));

    // Limpia la salida anterior y escribe todo de nuevo
    await rm(SALIDA, { recursive: true, force: true });

    await escribir("index.json", {
        musculos: `${BASE}/musculos`,
        huesos: `${BASE}/huesos`,
    });

    await escribir("musculos.json", {
        count: musculosSalida.length,
        results: musculosSalida.map((m) => ({
            ...refMusculo(m),
            region: m.region,
            imagen: m.imagen?.url ?? null,
        })),
    });
    for (const m of musculosSalida) await escribir(`musculos/${m.id}.json`, m);

    await escribir("huesos.json", {
        count: huesosSalida.length,
        results: huesosSalida.map((h) => ({
            ...refHueso(h),
            region: h.region,
            tipo: h.tipo,
            imagen: h.imagen?.url ?? null,
        })),
    });
    for (const h of huesosSalida) await escribir(`huesos/${h.id}.json`, h);

    console.log(`API generada: ${musculosSalida.length} músculos, ${huesosSalida.length} huesos.`);
}

main().catch((err) => {
    console.error("Error al generar la API:", err.message);
    process.exit(1);
});