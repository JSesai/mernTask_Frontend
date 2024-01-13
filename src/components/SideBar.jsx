
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth" //usamos nuestro hook que es una fn que llama al context de autenticacion de usuario

export default function SideBar() {
  const { auth } = useAuth() //llamamos la funcion y extraemos lo que retorna el context en auth
  return (
    <aside className="md:w-1/3 lg:w-1/5 xl:w-1/6 px-5 py-10 ">
      <p className="text-xl font-bold">Hola {auth.nombre}</p>

      <Link to="crear-proyecto" className="bg-sky-600 w-full p-3 text-white uppercase font-bold block mt-5 text-center rounded-lg">
      Nuevo Proyecto
      </Link>
    </aside>
  )
}
