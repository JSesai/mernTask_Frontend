//COMPONENETE QUE PROTEGE LAS RUTAS QUE ENVUELVE EN EL APP.JSX 
import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"; //hook propio para extraer informacion del context
import { Header, SideBar } from "../index"
export default function RutaProtegida() {

    const { auth, cargando } = useAuth() //Extrae lo que esta en el return en el context , el objeto tiene una propiedad llamada auth 
    // console.log(auth);
    
   
    if (cargando) return 'cargando..'
    return (
        <>
            {/* validamos por id la propiedad extraida si existe esta autenticado de lo contrario lo direccionamos al login  */}
            {auth?._id ?
                (
                    <div className="bg-gray-100">
                        <Header />
                        <div className="md:flex md:min-h-screen">
                            <SideBar />
                            <main className="p-10 flex-1">
                                <Outlet />
                            </main>
                        </div>
                    </div>
                ) : <Navigate to="/" />}

        </>
    )
}
