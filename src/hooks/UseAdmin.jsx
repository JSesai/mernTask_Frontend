import useProyectos from "./useProyectos";
import useAuth from "./useAuth";

const useAdmin = () => {
    //extraemos el proyecto que esta en el estate gracias al hook de useProyectos que recordemos es el que accede al provider y lo puedes ver como lo hace en el mismo archivo
    const { proyecto } = useProyectos();
    //extraemos al usuario autenticado gracias al hook de useAuth
    const { auth } = useAuth();

    //si el proyecto.creador es igual al auth._id entonces quiere decir que es el creador porque conincide el id del usuario autenticado con el id del creador
    return proyecto.creador === auth._id
}

export default useAdmin;