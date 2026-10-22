import { useEffect, useState } from "react";
import { obtener } from "../lib/api.js";

export function useApi(ruta) {
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let cancelado = false;
        setCargando(true);
        setError(null);
        setDatos(null);

        obtener(ruta)
            .then((resultado) => {
                if (!cancelado) setDatos(resultado);
            })
            .catch((e) => {
                if (!cancelado) setError(e.message);
            })
            .finally(() => {
                if (!cancelado) setCargando(false);
            });

        // Si el usuario cambia de página antes de que llegue la respuesta, la ignoramos
        return () => {
            cancelado = true;
        };
    }, [ruta]);

    return { datos, error, cargando };
}