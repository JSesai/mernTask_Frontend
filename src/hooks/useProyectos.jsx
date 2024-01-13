//ARCHIVO QUE NOS DA ACCESO AL PROVIDER CUANDO SE LLAMA DESDE DONDE SE QUIERE ACCEDER A LA INFO DEL CONTEXT DE PROYECTOS
import { useContext } from "react"; //importamos para poder llamar al useContext
import ProyectosContext from "../context/ProyectosProvider"; //importamos el context de nuestro archivo


//hook propio siempre es una funcion
const useProyectos = ()=>{

    //retornamos a lo que se accede gracias a la fn use context y le pasamos proyectContext que esta en  el provider que hemos creado 
    return(useContext(ProyectosContext))
}

export default useProyectos;