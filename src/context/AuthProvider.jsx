//ARCHIVO QUE CONTIENE EL CONTEXTO GLOBAL CON INFORMACION PARA PODER HACERLA ACCESIBLE EN TODA LA APP
import { useState, useEffect, createContext } from "react";
import AlertMessage from "../components/Alerta"
import clienteAxios from "../config/clienteAxios";
import { useNavigate, useParams, useLocation } from "react-router-dom"


const AuthContext = createContext(); //creamos el contexto 

//creamos el provider con la fn AuthProvider que rode a la App por eso recibe children
const AuthProvider = ({ children }) => {
    // informacion que sera disponible
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true); //arranca en true y cambia hasta que finalice la peticion
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    //comprobar si existe un token en el LS para autenticarlo en caso de que exista
    useEffect(() => {
        //fn que autentica al usuario
        const authUser = async () => {
            //extraemos el token de LS
            const token = tokenExists()
            if (!token) {
                setCargando(false);
                return;
            }

            //cabeceras para el envio de la peticion (objeto con la config)
            const config = {
                headers: {
                    "Content-Type": "application/json", //tipo de contenido
                    Authorization: `Bearer ${token}`, //enviamos el tipo de autenticacion que es Bearer y el JWT que es nuestro token

                }
            }

            //si hay token se intenta autenticar al usuario con JWT
            try {
                //extraemos la respuesta de nuestar peticion lo hacemos con await para que se detenga la ejecucion hasta obtener la respuesta de lo contrario sigue ejecutando y data se llena con valor de undefind
                const { data: { user: userReceived } } = await clienteAxios('users/profile', config);
                const user = {
                    _id: userReceived.id,
                    name: userReceived.nombre,
                    email: userReceived.email,
                    rolUser: userReceived?.rolUser ? userReceived.rolUser : null
                }
                console.log(user);
                setAuth(user);
                navigate('/dashboard')

            } catch (error) {
                console.log(error);
                setAuth({});
                localStorage.clear()
            } finally {
                setCargando(false);
            }

        }

        authUser();

    }, [])

   
    //valida que exista un token
    const tokenExists = () => {
        const token = localStorage.getItem('token');

        //si no existe el token lo regresamos al login
        if (!token) {
            console.log("No existe token");
            return navigate("./")
        }

        return token
    }

    //fn para cerrar la sesion de la autenticacion
    const cerrarSesionAuth = () => {
        //seteamos los estates a vacios para 
        localStorage.clear()
        setAuth({})
    }

    //muestra alerta en base al objeto recibido
    const showAlert = (infoAlert) => {
        AlertMessage(infoAlert)
    };


    if (cargando) {
        showAlert({ typeAlert: 'loading' })
    }
    if(!cargando){
        showAlert({ typeAlert: 'closeAlert' })
    }

    //retornamos el context
    return (
        <AuthContext.Provider
            value={{ //prop que devuelve informacion  en un objeto que es la que esta disponible para los componentes
                setAuth,
                auth,
                cargando,
                setCargando,
                cerrarSesionAuth,
                showAlert,
                navigate,
                params,
                location,
                tokenExists,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}
export default AuthContext;