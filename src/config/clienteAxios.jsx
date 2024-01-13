//ARCHIVO CON LA CONFIGURACION PARA LAS PETICIONES CON AXIOS
import axios from "axios";
//crate crea la configuracion
const clienteAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api` //url tomada del .env y añadiendo /api
})

export default clienteAxios;
