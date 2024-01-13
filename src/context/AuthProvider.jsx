//ARCHIVO QUE CONTIENE EL CONTEXTO GLOBAL CON INFORMACION PARA PODER HACERLA ACCESIBLE EN TODA LA APP
import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
const AuthContext = createContext(); //creamos el contexto 

//creamos el provider con la fn AuthProvider que rode a la App por eso recibe children
const AuthProvider = ({ children }) => {
    // informacion que sera disponible
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true); //arranca en true y cambia hasta que finalice la peticion

    //comprobar si existe un token en el LS para autenticarlo en caso de que exista
    useEffect(() => {
        //fn que autentica al usuario
        const autenticarUsuario = async () => {
            //extraemos el token de LS
            const token = localStorage.getItem('token');
            //si no existe el token 
            if (!token) {
                setCargando(false)
                return //retorna y no continua la ejecucion
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
                const { data } = await clienteAxios('/usuarios/perfil', config);
                setAuth(data);//agregamos data que contien la informacion del usuario logueado 
                
            } catch (error) {
                console.log(error);
                setAuth({}); //si hay un error lo regresamos objeto vacio
            } finally {
                setCargando(false);
            }

        }

        autenticarUsuario(); //llamamos a la fn para autenticar usuario

    }, [])

    //fn para cerrar la sesion de la autenticacion
    const cerrarSesionAuth = () => {
        //seteamos los estates a vacios para 
        setAuth({})
    }

    //retornamos el context
    return (
        <AuthContext.Provider
            value={{ //prop que devuelve informacion  en un objeto que es la que esta disponible para los componentes
                setAuth,
                auth,
                cargando,
                cerrarSesionAuth
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