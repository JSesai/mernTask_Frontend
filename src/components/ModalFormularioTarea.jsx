import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import useProyectos from '../hooks/useProyectos' //hook propio que hace referencia al context 
import Alerta from './Alerta'
import { useParams } from 'react-router-dom' //importamos useparams para poder acceder al valor en la url

//opciones del select
const PRIORIDAD = ['Baja', 'Media', 'Alta']

const ModalFormularioTarea = () => {

    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [fechaEntrega, setFechaEntrega] = useState("")
    const [prioridad, setPrioridad] = useState("")
    const [idTarea, setIdTarea] = useState("")
    const params = useParams()

    const { modalFormularioTarea, handleModalTarea, mostrarAlerta, alerta, submitTarea, tarea } = useProyectos() //extraemos estado y fn para poder manejar el comportamiento del modal con la fn de useProyectos

    //usamos useefect para poder mostrar la tarea en el modal, esto es posible debido a que tiene como dependencia la tarea y cada que cxambia la tarea se ejecuta useefect
    useEffect(() => {
        
        //si existe un id es porque se trata de una tarea existente y se ha presionado el boton de editar
        if(tarea?._id){
            //setea los estates con los datos de la tarea para editar
            setIdTarea(tarea._id)
            setNombre(tarea.nombre);
            setDescripcion(tarea.descripcion)
            setFechaEntrega(tarea.fechaEntrega?.split('T')[0])
            setPrioridad(tarea.prioridad)
            return //retornamos para que ya no continue la ejecucion del codigo de abajp
        }
        // si no un id  no entra en el if de arriba y se setean los estates a vacios
        setIdTarea("")
        setNombre("")
        setDescripcion("")
        setFechaEntrega("")
        setPrioridad("")

    }, [tarea])


    //fn para el control del boton submit
    const handleSubmit = async (e) => {
        e.preventDefault()//se evita el envio por default 
        if ([nombre, descripcion, prioridad].includes('')) { //se valida que no existan datos vacios
            mostrarAlerta({ //si hay datos vacios seteamos la alerta con el mensaje a mostrar e indicando que hay un error
                msg: 'todos los campos son obligatorios',
                error: true
            })

            return
        }
        
       
        //fn que es extraida del proyectos provider y es accesible por medio de nuestro hook personalizado
        await submitTarea({ idTarea, nombre, descripcion, fechaEntrega, prioridad, proyecto: params.id,}) //usamos la fn y como recibe un objeto, lo construimos con los datos que tenemos en el estate y tambien pasamos el id del proyecto para que se pueda enviar al backend
        //despues de haber terminado la fn submit tarea de hacer su logica se setean los estates
        setNombre("")
        setDescripcion("")
        setFechaEntrega("")
        setPrioridad("")

    }

    //extraemos el mensaje de alerta en caso de que este disponible
    const { msg } = alerta
    return (
        <Transition.Root show={modalFormularioTarea} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={handleModalTarea}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">


                            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={handleModalTarea}
                                >
                                    <span className="sr-only">Cerrar</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>


                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-bold text-gray-900">
                                    {idTarea ? "Editar Tarea" : "Crear Tarea"}
                                    </Dialog.Title>
                                    {msg && <Alerta alerta={alerta} />}
                                    <form onSubmit={handleSubmit} className='my-10'>
                                        <div className='mb-5'>
                                            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='nombre'>
                                                Nombre Tarea
                                            </label>
                                            <input
                                                type="text"
                                                id='nombre'
                                                placeholder='Nombre de la Tarea'
                                                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                                                value={nombre}
                                                onChange={e => setNombre(e.target.value)}
                                            />

                                        </div>
                                        <div className='mb-5'>
                                            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='descripcion'>
                                                Descripción Tarea
                                            </label>
                                            <textarea
                                                type="text"
                                                id='descripcion'
                                                placeholder='Descripción de la Tarea'
                                                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                                                value={descripcion}
                                                onChange={e => setDescripcion(e.target.value)}
                                            />

                                        </div>
                                        <div className='mb-5'>
                                            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='fecha-entrega'>
                                                Fecha de Entrega
                                            </label>
                                            <input
                                                type="date"
                                                id='fecha-entrega'
                                                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                                                value={fechaEntrega}
                                                onChange={e => setFechaEntrega(e.target.value)}
                                            />

                                        </div>
                                        <div className='mb-5'>
                                            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='prioridad'>
                                                Prioridad
                                            </label>
                                            <select
                                                id='prioridad'
                                                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                                                value={prioridad}
                                                onChange={e => setPrioridad(e.target.value)}
                                            >
                                                <option value="">-- Seleccione --</option>
                                                {PRIORIDAD.map((opcion) => (
                                                    <option key={opcion} >{opcion}</option>
                                                ))}

                                            </select>

                                        </div>
                                        <input
                                            type="submit"
                                            value={idTarea ? "Guardar Cambios" : "Crear Tarea"}
                                            className=' text-sm bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded'
                                        />
                                    </form>

                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div >
            </Dialog >
        </Transition.Root >
    )
}

export default ModalFormularioTarea