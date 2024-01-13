import { formatearFecha } from "../helpers/FormatearFecha";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/UseAdmin";

export default function Tarea({ tarea }) {
    //destructuramos datos del objeto que llega por prop
    const { nombre, descripcion, fechaEntrega, prioridad, _id, estado } = tarea;

    //extraemos los datos del context
    const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos()

    const admin = useAdmin()

    // console.log(tarea);

    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div className="flex flex-col items-start">
                <p className="mb-1 text-xl">{nombre}</p>
                <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
                <p className="mb-1 text-sm">{formatearFecha(fechaEntrega)}</p>
                <p className="mb-1 text-gray-600">Prioridad: {prioridad}</p>
                {estado ? <p className="text-xs text-white font-bold bg-green-600 rounded-md uppercase p-1">Completado por: {tarea.completado.nombre}</p> : null}

            </div>
            <div className="flex flex-col md:flex-row gap-1">
                {admin && (
                    <button onClick={() => handleModalEditarTarea(tarea)} 
                    className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">Editar</button>
                )}


                <button
                    onClick={() => completarTarea(_id)}
                    className={`${estado ? "bg-sky-600 px-4 py-3" : "bg-gray-600 px-4 py-3"} text-white uppercase font-bold text-sm rounded-lg` }>
                    {estado ? 'Completa' : 'Incompleta'}
                </button>

                {/* <button onClick={()=> completarTarea(_id)} className="bg-gray-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">incompleta</button> */}


                {admin && (
                    <button onClick={() => handleModalEliminarTarea(tarea)} className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">eliminar</button>
                )}
            </div>

        </div>
    )
}
