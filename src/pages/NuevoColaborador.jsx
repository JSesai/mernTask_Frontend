
import { useEffect } from "react"
import FormularioColaborador from "../components/FormularioColaborador"
import { useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import Alerta from "../components/Alerta"

export default function NuevoColaborador() {
  const params = useParams() //usamos esta fn para recuperar la informacion que viene desde la url
  const { proyecto, obtenerProyecto, cargando, colaborador, agregarColaborador, alerta } = useProyectos(); //se llama fn y se extrae infirmacion que esta dispo en el context que esta en el area disponible del provider de ProyectosProvider.jsx

  useEffect(() => {
    
    if (!proyecto.nombre) { //si no existe el proyecto, es decir que no esta en el estate, esto suscede generalmente cuando se recarga la pagina por lo que necesitamos obtener el proyecto
      obtenerProyecto(params.id)// con esta fn obtenemos el proyecto y mandamos el id recuperado de la url
    }

  }, [])

  if(!proyecto?._id) return <Alerta alerta={alerta}/>

  return (
    <>
      <h1 className="text-4xl font-black">Añadir Colaborador(a) al proyecto: {proyecto.nombre}</h1>

      <div className="mt-10 flex justify-center">
        <FormularioColaborador />
      </div>
      {console.log()}
      {/* si cargando esta en true se muestra mensaje cargando, si no se evalua si existe id del colaborador si es true se retorna lo que esta al lado derecho */}
      {cargando ? <p className="text-center">Cargando...</p> : colaborador?._id && (
        <div className="flex justify-center mt-10 ">
          <div className="bg-white py-10 px-5 md:w-3/4 rounded-lg shadow w-full">
            <h2 className="text-center mb-10 text-2xl font-bold">Resultado:</h2>
            <div className="flex justify-between items-center">
              <p>{colaborador.nombre}</p>
              <button onClick={() => agregarColaborador({email: colaborador.email})} type="button" className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm ">Agregar al proyecto</button>

            </div>

          </div>

        </div>
      )}

    </>
  )
}
