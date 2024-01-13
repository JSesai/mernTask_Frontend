import { useEffect } from "react";
import { useParams, Link } from "react-router-dom"
import { useProyectos, ModalFormularioTarea, ModalEliminarTarea, Tarea, Alerta, Colaborador, ModalEliminarColaborador } from "../index";
import useAdmin from "../hooks/UseAdmin";
import io from "socket.io-client" //importamos la libreria que hemos instalado previamente con npm i socket.io-client

let socket;


export default function Proyecto() {
    const params = useParams()
    const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, completarTareaProyecto } = useProyectos(); //se llama fn y se extrae infirmacion que esta dispo en el context que esta en el area disponible del provider de ProyectosProvider.jsx
    const admin = useAdmin()
    const { nombre } = proyecto; //estraemos los datos del objeto de proyecto 
    //ussamos useefect para que una vez montado el componente mande a llamar a la funcion que extraimos desde el hook del context que apunta al provider de proyectos
    useEffect(() => {
        obtenerProyecto(params.id); //usamos la fn y pasamos el id para que obtenga el proyecto especificado en ese id

    }, [])
    //se ejecuta una vez para abrir la conexion una vez montado el componente haga la conexion con socket.io con el server
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL) //Abre conexion en socket io hacia la url que esta en el archivo env que son para nuestras variables de entorno 
        //emitimos un evento para que lo escuche el server, como ya tenemos abierta la conexion es posible emitir eventos
        socket.emit('abrir proyecto', params.id ) //pasamos como parametro el id del proyecto que tenenemos acceso al id por medio de la url
       
    }, [])
    
    //este useefect no tiene dependencias por lo que se estara ejecutando constantemente y es a es la idea para que este escuchando el evento emitido por el back tarea agregada
    useEffect(() => {
        //escucha para capturar el evento tarea agregada que corresponde a cuando se agrega una nueva tarea en el proyecto y se pueda actualizar en tiempo real a todos los usuarios que esten en esa sala
        socket.on('tarea agregada', tareaNueva => {
            //si la tarea nueva es del proyecto entonces actualiza el estate
            if(tareaNueva.proyecto === proyecto._id ){
                submitTareasProyecto(tareaNueva); //fn que actualiza el estate con la nueva tarea
            }
        });

        //escucha para capturar el evento tarea eliminada que sucede cuando desde el provicer se elimina una tarea, una vez procesada la eliminacion se manda al server socket y ahi recibe la tarea y devuelve  este emit que estamos escuchando y simplemente pasamos la tarea a esta funcion para que actualice el estate y todos puedan verlo en tiempo real
        socket.on('tarea eliminada', tareaEliminada => {
            //si la tarea eliminada es igual al proyecto en el que nos encontramos entonces se actualizara el estate, esto lo hacemos porque tenemos todos lo proyectos y debemos identificar cual es el proyecto que una de sus tareas han sido eliminadas
            if(tareaEliminada.proyecto === proyecto._id){
                //se ejecuta la funcion para actualizar el state y le pasamos la tareaEliminada
                eliminarTareaProyecto(tareaEliminada)
            }
        });

        //escucha evento tarea actualizada emitida por el server
        socket.on('tarea actualizada', tareaActualizada => {
            // console.log(tareaActualizada);
            //si la tarea actualizada corresponde al proyecto en el que nos encontramos entonces actualiza la tarea con la fn que es extraida del provider
            if(tareaActualizada.proyecto._id === proyecto._id){
                // console.log('actualizando');
                actualizarTareaProyecto(tareaActualizada)
            }
        });

        //escucha evento tarea completada y ejecuta fn del provider para actualizar en tiempo real
        socket.on('tarea completada', tareaCompletada => {
            // console.log(tareaCompletada);
            if(tareaCompletada.proyecto._id === proyecto._id){
                // console.log('actualizando');
                completarTareaProyecto(tareaCompletada)
            }
        });
    })
    // console.log(proyecto);
    // console.log(admin);
    // console.log(params);

    if (cargando) return '...';
  
    return (

        <>
            <div className="flex justify-between">
                <h1 className="font-black text-4xl">{nombre}</h1>
                {/* si es admin entonces se vera la funcionalidad de editar */}
                {admin && (
                    <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700">
                        {/* imagen svg de https://heroicons.com/ */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        <Link //enlace para editar proyecto para esto pasamos el id por url
                            to={`/proyectos/editar/${params.id}`}
                            className="uppercase font-bold"
                        >
                            Editar
                        </Link>

                    </div>
                )
                }

            </div>
            {/* si es admin podra ver la funcionalidad de agregar nueva tarea */}
            {admin && (
                <button onClick={handleModalTarea} type="button" className=" flex gap-2 text-sm mt-5 px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center hover:bg-sky-800 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Nueva Tarea
                </button>
            )
            }

            <p className="font-bold text-2xl mt-10 ">Tareas del Proyecto</p>
           

            <div className="bg-white shadow mt-10 rounded-lg">
                {proyecto.tareas?.length ?
                    <>
                        {proyecto.tareas?.map(tarea => (
                            <Tarea key={tarea._id} tarea={tarea} />
                        ))}
                    </>
                    : <p className="text-center my-5 p-10">No hay tareas en este proyecto</p>}
            </div>

            {admin && (
                <>

                    <div className="flex items-center justify-between mt-10">
                        <p className="font-bold text-2xl">Colaboradores</p>
                        {/* le mandamos el id del proyecto en la url para identificar a que proyecto se le quiere agregar el colaborador */}
                        <Link
                            className="text-gray-400 uppercase font-bold hover:text-black"
                            to={`/proyectos/nuevo-colaborador/${proyecto._id}`}>
                            Añadir
                        </Link>

                    </div>

                    <div className="bg-white shadow mt-10 rounded-lg">
                        {proyecto.colaboradores?.length ?
                            <>
                                {proyecto.colaboradores?.map(colaborador => (
                                    <Colaborador key={colaborador._id} colaborador={colaborador} />
                                ))}
                            </>
                            : <p className="text-center my-5 p-10">No hay Colaboradores en este proyecto</p>}
                    </div>
                </>
            )}


            {/* componente modal, */}
            <ModalFormularioTarea />
            <ModalEliminarTarea />
            <ModalEliminarColaborador />
        </>)


}
