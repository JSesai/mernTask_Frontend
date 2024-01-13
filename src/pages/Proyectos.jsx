import { PreviewProyecto, useProyectos } from "../index"
import io from "socket.io-client" //importamos la libreria que hemos instalado previamente con npm i socket.io-client

let socket;
export default function Proyectos() {
  
  const { proyectos } = useProyectos(); //se llama fn y se extrae infirmacion que esta dispo en el context

  // useEffect(()=> {
  //   socket = io(import.meta.env.VITE_BACKEND_URL)//Abre conexion en socket io hacia la url que esta en el archivo env que son para nuestras variables de entorno
  //   socket.emit('prueba', "Julio") //emite un evento de nombre prueba y pasa un string como parametro

  //   //tambien se puede cachar una respuesta
  //   socket.on('respuesta', (persona)=> {
  //     console.log('desde el frontend', persona);
  //   })
  // },[])

  return (
    <>
      <h1 className="text-4xl font-black ">Proyectos</h1>
      
      <div className="bg-white shadow mt-10 rounded-lg m-1">
        {proyectos?.length ? 
           
          proyectos?.map(proyecto => (
            
            <PreviewProyecto key={proyecto._id} proyecto={proyecto}> </PreviewProyecto>
          ))

        : <p className= " text-center text-gray-600 uppercase p-5 ">No Hay Proyectos Aún</p> }

      </div>
    </>
  )
}
