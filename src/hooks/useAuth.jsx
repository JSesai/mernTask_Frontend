//ARCHIVO PERSONALIZADO PARA MANEJAR EL CONTEXT CON HOOK PROPIO
import { useContext  } from "react"; //Importamos use context para poder acceder al context
import AuthContext from "../context/AuthProvider"; //importamos nuesto context default

//Fn que nos ayuda a acceder a la informacion de autenticacion que se encuentra en el AuthContext
const useAuth = ()=> {

    //accedemos al context con useContext y pasamos nustro context, con esto hara disponible la informacion que retorna el provider de AuthProvider
    return useContext(AuthContext)
}

export default useAuth;