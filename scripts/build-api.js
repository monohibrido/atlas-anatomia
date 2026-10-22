import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(__dirname, "..");
const DATA = path.join(RAIZ, "data");
const SALIDA = path.join(RAIZ, "public", "api", "v1");
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

function validarIdsUnicos(lista, tipo) {
    const vistos = new Set();
    for (const item of lista) {
        if (vistos.has(item.id)) {
            throw new Error(`ID duplicado en ${tipo}: "${item.id}"`);
        }
        vistos.add(item.id);
    }
}

async function main() {
    const musculos = await leerJSON("musculos.json");
    const huesos = await leerJSON("huesos.json");

    validarIdsUnicos(musculos, "músculos");
    validarIdsUnicos(huesos, "huesos");

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
            origen: convertir(m.origen, "origen"),
            insercion: convertir(m.insercion, "insercion"),
        };
    });

    // Huesos: agrega automáticamente los músculos relacionados (relación inversa)
    const huesosSalida = huesos.map((h) => ({
        ...h,
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
        results: musculosSalida.map((m) => ({ ...refMusculo(m), region: m.region })),
    });
    for (const m of musculosSalida) await escribir(`musculos/${m.id}.json`, m);

    await escribir("huesos.json", {
        count: huesosSalida.length,
        results: huesosSalida.map((h) => ({ ...refHueso(h), region: h.region, tipo: h.tipo })),
    });
    for (const h of huesosSalida) await escribir(`huesos/${h.id}.json`, h);

    console.log(`API generada: ${musculosSalida.length} músculos, ${huesosSalida.length} huesos.`);
}

main().catch((err) => {
    console.error("Error al generar la API:", err.message);
    process.exit(1);
});