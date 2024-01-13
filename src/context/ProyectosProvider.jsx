//ARCHIVO QUE PONE LOS PROYECTOS EN EL CONTEXT PARA QUE SEAN ACCESIBLES DESDE CUALQUIER LUGAR
import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client" //importamos la libreria que hemos instalado previamente con npm i socket.io-client
import useAuth from "../hooks/useAuth";
let socket; //variable global que la usaremos para abrir la conexion


const ProyectosContext = createContext(); //creamos context


//creamos el provider que contiene en el return lo que esta disponible en value es a lo que se accede con context
const ProyectosProvider = ({ children }) => {
    const [proyectos, setProyectos] = useState([]); //estate que contiene los proyectos y se llena una vez que se hace la peticion con axios;
    const [proyecto, setProyecto] = useState({}); //estate que contiene un proyecto y se llena una vez que se hace la peticion con axios;
    const [alerta, setAlerta] = useState({}); //estate para guardar la informacion y setear informacion de alertas
    const [cargando, setCargando] = useState(false); //estate que ayuda a mostrar algun mensaje gracias a ser true y cuando es false no, esto sucede cuando se esta haciaendo la peticion
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false); //estado para mostrar el modal formulario tarea cuando este en true
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false); //estado para mostrar el modal eliminar tarea cuando este en true
    const [tarea, setTarea] = useState({}); //estate para una tarea
    const [colaborador, setColaborador] = useState({}); //estate para colaborador
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false) // estate para mostrar el modal de confirmacion de eliminar colaborador
    const [buscador, setBuscador] = useState(false); //estate para manejar eñ modal del buscador

    const navigate = useNavigate(); //fn para navegar
    const { auth } = useAuth() //fn que para acceder al provider de autenticacion y poder extraer lo que estra diponible en el context

    //useEfect para consultar la bd y cargar los proyectos para poder mostarlos
    useEffect(() => {
        const obtenerProyectos = async () => { //fn asincrona para obtener proyectos
            try {
                //para consultar proyectos se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
                const token = localStorage.getItem('token');
                //si no existe el token lo regresamos al login
                if (!token) {
                    console.error("No existe token");
                    return navigate("./")
                }
                //construimos las cabeceras para el envio de la peticion (objeto con la config)
                const config = {
                    headers: {
                        "Content-Type": "application/json", //tipo de contenido que es json en el body
                        Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                    }
                }
                //extraemos la respuesta de nuestar peticion get devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
                const { data } = await clienteAxios('/proyectos', config); //enviamos en este orden, primero el body y seguido la configuracion
                console.log(data);
                //llenamos el estate con los datos que nos retorna el back que son los proyectos
                setProyectos(data);

            } catch (error) {
                console.log(error);
            }

        }
        obtenerProyectos()
    }, [auth])

    //useefect que se encargara unicamente de la conexion, por lo que solo se ejecutara una vez y en el resto de este provider se hara uso de los emit
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    //fn que setea alerta, recibe el objeto con los datos para mostrar la alerta y se hace disponible en el context para acceder a ella desde cualqiier parte de la app
    const mostrarAlerta = (alerta) => {
        setAlerta(alerta);
        setTimeout(() => {
            setAlerta({})
        }, 3000);

    }

    //fn para obtener todos los proyectos 
    const obtenerProyectos = async () => { //fn asincrona para obtener proyectos
        try {
            //para consultar proyectos se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //si no existe el token lo regresamos al login
            if (!token) {
                console.error("No existe token");
                return navigate("./")
            }
            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }
            //extraemos la respuesta de nuestar peticion get devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios('/proyectos', config); //enviamos en este orden, primero el body y seguido la configuracion
            console.log(data);
            //llenamos el estate con los datos que nos retorna el back que son los proyectos
            setProyectos(data);

        } catch (error) {
            console.log(error);
        }

    }


    //fn  para crear o editar un proyecto
    const submitProyecto = async proyecto => {
        //evaluamos si el objeto proyecto trae un id quiere decir que se esta modificando, de lo contrario se esta creando uno nuevo
        if (proyecto.id) {
            await editarProyecto(proyecto) //edita proyecto
        } else {
            await crearProyecto(proyecto); //crea proyecto
        }
    }

    //fn para editar proyecto
    const editarProyecto = async (proyecto) => {
        try {
            //console.log(proyecto);
            //para crear un nievo proyecto se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //si no existe el token lo regresamos al login
            if (!token) {
                console.error("No existe token");
                return navigate("./")

            }

            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }

            //extraemos la respuesta de nuestar peticion put post devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config); //enviamos en este orden, primero el body y seguido la configuracion
            console.log(data);
            // cramos un nuevo arreglo para actualizart el estate con el objeto modificado. por lo que hacemos un map para crear un nuevo arreglo con los objetos , compara para encontrar el objeto si encuentra un objeto que haga match con el id del dato devuelto  en la peticion anterior lo reemplaza en el arreglo, caso contrario retorna lo que ya esta en el state
            const ProyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            //actualizamos el estate con los datos ya actualiados
            setProyectos(ProyectosActualizados)

            //creamos alerta para indicar al usuario que se ha creado correctanente el proyecto
            setAlerta({
                msg: "Proyecto Actualizado Correctamente",
                error: false
            })

            //despues de 3 seg borramos la alerta y direccionamos a proyectos
            setTimeout(() => {
                setAlerta({}) //seteamos la alerta
                navigate("/proyectos") //direccionamos
            }, 3000);

        } catch (error) {
            console.log(error);

        } finally {

        }
    }

    //fn para crear un nuevo proyecto
    const crearProyecto = async (proyecto) => {
        try {
            //console.log(proyecto);
            //para crear un nievo proyecto se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //si no existe el token lo regresamos al login
            if (!token) {
                console.error("No existe token");
                return navigate("./")

            }

            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }

            //extraemos la respuesta de nuestar peticion post post devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios.post('/proyectos', proyecto, config); //enviamos en este orden, primero el body y seguido la configuracion
            console.log(data);
            //tomamos una copia del estate de proyectos y le agregamos el que acabamos de crear con fn seteadora, para tener actualizado el estate, esto con la finalidad de no volver a consultar la base de datos
            // setProyectos([...proyectos, data])
            //creamos alerta para indicar al usuario que se ha creado correctanente el proyecto
            setAlerta({
                msg: "Proyecto Creado Correctamente",
                error: false
            })

            //despues de 3 seg borramos la alerta y direccionamos a proyectos
            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 3000);

        } catch (error) {
            console.log(error);

        } finally {

        }
    }


    //fn para obtener un proyecto y ponerlo disponible en el context
    const obtenerProyecto = async (id) => {
        setCargando(true); // se muestra cargando
        try {
            //para consultar un proyecto se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //si no existe el token lo regresamos al login
            if (!token) {
                console.error("No existe token");
                return navigate("./")

            }
            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }
            //extraemos la respuesta de nuestar peticion get devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios(`/proyectos/${id}`, config); //enviamos en la url el id del proyecto que se solicita,y seguido la configuracion que tiene el token para poderse autenticar
            // console.log(data);
            setProyecto(data);
        } catch (error) {
            console.log(error);
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })

        } finally {
            setCargando(false); //cambiamos el estado para que se deje de mostrar el mensaje loader
        }
    }

    //fn para eliminar proyecto
    const eliminarProyecto = async (id) => {
        setCargando(true); //se muestra cargando
        //encerramos en el try nuestra peticion a la bd
        try {
            //para eliminat un proyecto se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //valaidamos si no existe el token
            if (!token) {
                console.error("No existe token");
                return navigate("./") //redirecciona al login
            }

            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }
            //extraemos la respuesta de nuestar peticion delete devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config); //enviamos en la url el id del proyecto que se solicita,y seguido la configuracion que tiene el token para poderse autenticar
            //construimos un array excluyendo al que fue eliminado
            const proyectosActualizados = proyectos.filter((proyecto) => proyecto._id !== id)
            // console.log(proyectosActualizados);
            setProyectos(proyectosActualizados) //seteamos el estate de proyectos para que ya no se muestr el eliminado
            //creamos alerta para indicar al usuario que se ha creado correctanente el proyecto
            setAlerta({
                msg: "Proyecto Eliminado Correctamente",
                error: false
            })

            //  despues de 3 seg borramos la alerta y direccionamos a proyectos
            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 3000);

        } catch (error) {
            console.log(error);
            setAlerta({
                msg: error,
                error: true
            })
        } finally {
            setCargando(false); //se quita mensaje cargando
            setAlerta({}); //seteamos la alerta
        }

    }

    //fn para cambiar el estado del modal mostrar o no
    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea) //se setea a lo opuesto que tenga el modal
        setTarea({}) //seteamos el modal para que cuando cierre los valores de tarea sean vacios y con esto no se muestre nada la proxima vez que se abra el modal
    }

    //fn asincrona para enviar tarea al backend, recibe objeto con los datos de la tarea
    const submitTarea = async tarea => {
        //si existe el id entonces se trata de una tarea ya existente por lo que se debe de ejecutar actualizar tarea
        if (tarea?.idTarea) {
            console.log('actualizar tarea...');
            await editarTarea(tarea);
        } else {
            //si no existe el id estamos creando tarea por lo que se ejecuta la fn de crear tarea
            console.log('crear tarea...');
            await crearTarea(tarea)

        }

    }
    //fn para crear una tarea recibe el objeto de la tarea para crearla
    const crearTarea = async (tarea) => {
        try {
            console.log(tarea);
            //para crear un nievo proyecto se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //si no existe el token lo regresamos al login
            if (!token) {
                console.error("No existe token");
                return navigate("./")

            }

            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }

            //extraemos la respuesta de nuestar peticion post post devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios.post('/tareas', tarea, config); //enviamos en este orden, primero el body y seguido la configuracion
            console.log(data);

            //seteamos a vacia la alerta
            setAlerta({})
            setModalFormularioTarea(false) //quitamos el modal

            //socket io
            socket.emit('nueva tarea', data) //emitimos un evento al back y le pasamos lo que nos ha regresado el back anteriormente en la respuesta al procesar la nueva tarea

        } catch (error) {
            console.log(error);
        }
    }

    //fn para editar tarea recibe el objeto de la tarea a editar
    const editarTarea = async (tarea) => {

        //hacemos consulta siempre con try catch para poder editar la tarea
        try {
            //para crear un nievo proyecto se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //si no existe el token lo regresamos al login
            if (!token) {
                console.error("No existe token");
                return navigate("./")

            }

            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }

            //extraemos la respuesta de nuestar peticion put devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios.put(`/tareas/${tarea?.idTarea}`, tarea, config); //enviamos en este orden, primero el body y seguido la configuracion
            console.log(data);
            setAlerta({});
            setModalFormularioTarea(false)

            //usamos socket para tener actualizado en tiempo real las tareas editadas
            socket.emit('actualizar tarea', data);

        } catch (error) {
            console.log(error);
        }

    }

    //fn para setear state de tarea 
    const handleModalEditarTarea = tarea => {
        console.log(tarea);
        setTarea(tarea); //añadimos la tarea recibida al estate
        setModalFormularioTarea(true); //mostramos el modal
    }

    //fn para setear tarea cuando se quiera eliminar, se pondra en el estate la tearea a eliminar
    const handleModalEliminarTarea = tarea => {
        setTarea(tarea); //ponemos en el estate la tarea que vamos a eliminar
        setModalEliminarTarea(!modalEliminarTarea); //setea el modal de eliminar tarea, para que pueda mostrarse y ocultarse

    }

    //fn que se ejcuta cuando se confirma desde el modal la eliminacion del proyecto, el proyecto se encuentra en el estate por lo que ese es el que se eliminara
    const eliminarTarea = async () => {
        //hacemos consulta siempre con try catch para 

        try {
            //para eliminar tarea se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //si no existe el token lo regresamos al login
            if (!token) {
                console.error("No existe token");
                return navigate("./")

            }

            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }

            //extraemos la respuesta de nuestar peticion put devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios.delete(`/tareas/${tarea?._id}`, config); //enviamos en la url el id de la tarea que se va a eliminar y seguido la configuracion
            // console.log(data);
            //mostramos la alerta 
            mostrarAlerta({
                msg: data.msg,
                error: false
            });

            //socekt io
            socket.emit('eliminar tarea', tarea); //ya eliminada por lo realizado anteriormente, emite un evento eliminar tarea y le pasamos la tarea que aun esta viva en el state , para que se pueda actualizar en tiempo real cuando refrese la respuesta


        } catch (error) {
            console.log(error);
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            });

        } finally {
            setModalEliminarTarea(false); //ponemos en false para ocultar el modal
            setTarea({}) //limpiamos el estate de la tarea 
        }


    }

    //fn que envia correo para buscar usuario para despues agregarlo como colaborador 
    const submitColaborador = async email => {

        try {
            //para crear un nievo proyecto se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //si no existe el token lo regresamos al login
            if (!token) {
                console.error("No existe token");
                return navigate("./")
            }
            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }

            //loader de carga, inicia cuando se hace la peticion
            setCargando(true)

            //extraemos la respuesta de nuestar peticion post devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios.post("proyectos/colaboradores", { email }, config); //enviamos en este orden, primero el body y seguido la configuracion
            console.log(data);
            //seteamos el estate de colaborador con el objeto del usuario devuelto en la respuesta de la peticion
            setColaborador(data);



        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
            console.log(error);
        } finally {
            setCargando(false)
        }
    }

    //fn que agrega colaborador
    const agregarColaborador = async email => {
        try {
            console.log(email);
            //para crear un nievo proyecto se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //si no existe el token lo regresamos al login
            if (!token) {
                console.error("No existe token");
                return navigate("./")
            }
            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }

            //loader de carga, inicia cuando se hace la peticion
            setCargando(true)
            //extraemos la respuesta de nuestar peticion post devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios.post(`proyectos/colaboradores/${proyecto?._id}`, email, config); //enviamos en este orden, primero el body y seguido la configuracion
            console.log(data);
            mostrarAlerta({
                msg: data.msg,
                error: false
            })

        } catch (error) {
            console.log(error);
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
            setColaborador({})
        }
    }

    //fn asincrona que recibe un colaborador, setea el estate para mostrar el modal de eliminar colaborador y lo pone en el estate
    const handleEliminarColaborador = async colaborador => {
        console.log(colaborador);
        setModalEliminarColaborador(!modalEliminarColaborador); //Cambia el state para mostrar el modal
        setColaborador(colaborador); //seteamos el estate con informacion del colaborador
    }

    //fn para eliminar colaborador, esta disponible en el modal de eliminar colaborador por lo que para este momento ya tenemos en el estate al usuario que deseamos eliminar
    const eliminarColaborador = async (email) => {

        try {
            console.log(colaborador);
            //para crear un nievo proyecto se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //si no existe el token lo regresamos al login
            if (!token) {
                console.error("No existe token");
                return navigate("./")
            }
            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }
            console.log('eliminando a:', colaborador._id);

            //loader de carga, inicia cuando se hace la peticion
            setCargando(true)
            //extraemos la respuesta de nuestar peticion post devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios.post(`proyectos/eliminar-colaborador/${proyecto?._id}`, email, config); //enviamos en este orden, primero el body y seguido la configuracion
            console.log(data);
            const proyectoActualizado = { ...proyecto }
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id);
            setProyecto(proyectoActualizado);
            mostrarAlerta({
                msg: data.msg,
                error: false
            })

        } catch (error) {
            console.log(error);
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
            setColaborador({})
            setModalEliminarColaborador(false)
        }


    }

    //fn que cambia una tarea a completa o incompleta
    const completarTarea = async id => {
        try {
            //para crear un nievo proyecto se requiere autenticar al usuario en el backend y lo hacemos con un token, si esta logeado debe existir un token en LS por lo que lo extraemos
            const token = localStorage.getItem('token');
            //si no existe el token lo regresamos al login
            if (!token) {
                console.error("No existe token");
                return navigate("./")
            }
            //construimos las cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido que es json en el body
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token
                }
            }

            //extraemos la respuesta de nuestar peticion post devuelta por el backend, lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config); //enviamos en este orden, primero el body y seguido la configuracion
            console.log(data);
            setTarea({}) //seteamos la tarea
            setAlerta({})
            //socket.io 
            socket.emit('completar tarea', data)
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    //fn que cambia el estado de buscador
    const handleBuscador = () => {
        setBuscador(!buscador);

    }

    //fn para actualizar en tiempo real el estate con la tarea agregada y que viene del server de socket 
    const submitTareasProyecto = (tarea) => { //recibe la tarea que fue agregada

        //tomamos una copia del estate del proyecto actual
        const proyectoActualizado = { ...proyecto }
        //accedemos a tareas y le insertamos una copia de las tareas de proyecto y le añadimos la tarea que agregamos y que nos fue devuelta en la respuesta de la peticion
        proyectoActualizado.tareas = [...proyecto.tareas, tarea]
        //seteamos el estate con los datos actualizados
        setProyecto(proyectoActualizado)
    }

    //fn para actualizar en tiempo real el proyecto y quitar la terea eliminada, este viene del componente propyecto y este a su vez le llega desde el server de socket
    const eliminarTareaProyecto = tarea => {
        //actualizar el estate de las tareas por lo que hay que hacer varios pasos, primero copiar el proyecto acceder al arreglo de tareas y actualizar el arreglo con lo que nos ha devuelto el servidor al actualizar la tarea
        const proyectoActualizado = { ...proyecto } //Creamos una acopia del proyecto y lo guardamos en const
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(item => item._id !== tarea._id) //construimos un arraay con filter discriminando el que se elimino
        console.log(proyectoActualizado);
        setProyecto(proyectoActualizado); //seteamos el estate con los datos actualizados

    }

    //fn para actualizar en tiempo real el proyecti y actualizar la tarea actualizada, esta fn es consumida desde proyecto y este a su vez le llegas desde el server de socket
    const actualizarTareaProyecto = tarea => {
        console.log(tarea);
        //actualizar el estate de las tareas por lo que hay que hacer varios pasos, primero copiar el proyecto acceder al arreglo de tareas y actualizar el arreglo con lo que nos ha devuelto el servidor al actualizar la tarea
        const proyectoActualizado = { ...proyecto } //Creamos una acopia del proyecto y lo guardamos en const
        //Accedemos a tareas para iterar el arreglo de tareas
        console.log(proyectoActualizado);
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(item => item._id === tarea._id ? tarea : item) // si el item._id de la tarea es igual al _id de data. Si es así, reemplaza toda la tarea con data. Si no, mantienes la tarea original.
        setProyecto(proyectoActualizado);
    }

    //fn para completar una tarea del proyecto
    const completarTareaProyecto = tarea => {
        console.log(tarea);

        const proyectoActualizado = { ...proyecto };
        //iteramos sobre tareas para poder actualizar el estate, por cada elemento del arreglo que recorre evalua si el id actual es igual que el id de lo que regresa en data retornamos el obj que viene en data si no coincide regresa lo que hay en el estate, esto es para que si no coincide regresa lo que ya hay y si si coincide lo sustituye con lo que llega como respuesta en el data desde el server
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState);
        // seteamos el estate con el proyecto actualizado
        setProyecto(proyectoActualizado)
    }

    //fn para manejar el cierre de sesion del usuario
    const cerrarSesionProyectos = () => {
        //seteanos los estates para no dejarlos vivos con valores, los seteamos a su valor incial
        setProyectos([]);
        setProyecto({});
        setAlerta({});
        console.log('cerrando...');
    }
    //informacion para que este disponible en el context debe estar en el objeto de value
    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                obtenerProyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                handleModalTarea,
                modalFormularioTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                modalEliminarColaborador,
                handleEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                completarTareaProyecto,
                cerrarSesionProyectos

            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export { ProyectosProvider };
export default ProyectosContext;