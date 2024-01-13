import { useEffect, useState } from "react"
import useProyectos from "../hooks/useProyectos" //llamamos nuestro hook para acceder a context de proyectos
import Alerta from "./Alerta" //componete para mostrar alertas
import { useParams } from "react-router-dom"

export default function FormularioProyecto() {

    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cliente, setCliente] = useState('')
    const [id, setId] = useState (null) //funcion que se llena con el id del proyecto solo si se esta editando, de esta forma podemos pasarlo en el submitProyecto para que se pueda evaluar y si existe el id se ejecute la opcion de editar o crear nuevo proyecto
    
    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos(); //extraemos datos, alerta tiene la info de alerta, y  fn que setea alerta y esta dispo en el provider de proyectos y se accede con el hook useProyectos
    const params = useParams(); //capturamos lo que venga por id
    useEffect(()=>{
        if(params.id) { //si llega un id por la url significa que ha sido enviado para editar por lo que debemos de rellenar los estates con la informacion del proyecto a editar
            const { nombre, cliente, descripcion, fechaEntrega, _id } = proyecto; //extraemos los datos del objeto de proyecto 
            //setemaos con los datos extraidos, para que sean visibles en el formulario
            setNombre(nombre)
            setDescripcion(descripcion)
            setFechaEntrega(fechaEntrega?.split('T')[0])
            setCliente(cliente)
            //rellenamos el estate de id, para que cuando se ejecute el handlesubmit puede ser enviado en el parametro de submitProyecto
            setId(_id)
        }

    },[])
   
    const handleSubmit = async (e) => {
        e.preventDefault() //previene envio por default

        //validamos si hay inputs vacios, los encerramos en corchetes para poder usar includes
        if ([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            //seteamos fn que extraimos del context 
            mostrarAlerta({
                msg:"Todos Los campos son Obligatorios",
                error:true
            })
            return
        }

        //fn que viene del context y envia los datos necesarios para que en el provider haga el envio de la peticion
        await submitProyecto({nombre, descripcion, fechaEntrega, cliente, id});

        //cuando continua la ejecucion  seteamos los estates
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')
        //seteamos el  id que solo existe si el proyecto ya fue creado
        setId(null);
    }    

    return (

        <form onSubmit={handleSubmit} className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow-xl">
          
          {alerta?.msg && <Alerta alerta={alerta} />}
            
            <div className="mb-5">
                <label htmlFor="nombre" className="text-gray-700 uppercase font-bold text-sm">Nombre Proyecto</label>
                <input
                    id="nombre"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Nombre del Proyecto"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                />
            </div>

            <div className="mb-5">
                <label htmlFor="descripcion" className="text-gray-700 uppercase font-bold text-sm">Descripción Proyecto</label>
                <textarea
                    id="descripcion"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Descripción del Proyecto"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                />
            </div>

            <div className="mb-5">
                <label htmlFor="fecha-entrega" className="text-gray-700 uppercase font-bold text-sm">Fecha Entrega</label>
                <input
                    id="fecha-entrega"
                    type="date"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    value={fechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)}
                />
            </div>

            <div className="mb-5">
                <label htmlFor="cliente" className="text-gray-700 uppercase font-bold text-sm">Nombre Cliente</label>
                <input
                    id="cliente"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Nombre del Cliente"
                    value={cliente}
                    onChange={e => setCliente(e.target.value)}
                />
            </div>

            <input
                type="submit"
                value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 hover:transition-colors"
            />

        </form>
    )
}
