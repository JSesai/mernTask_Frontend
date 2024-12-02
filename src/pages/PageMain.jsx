import React from 'react'
import useAuth from "../hooks/useAuth"; //fn hook propio que nos permite acceder a nuestro context de autenticacion AuthContext



export default function PageMain() {
    const { auth, showAlert, navigate } = useAuth();

    console.log(auth._id);
    

    return (
        <>
            {/* validamos por id la propiedad extraida si existe esta autenticado de lo contrario lo direccionamos al login  */}
            {auth?._id ?
                (
                    <div className="bg-gray-100">
                        <Header />
                        <div className="md:flex md:min-h-screen">
                            <SideBar />
                            <main className="p-4 flex-1">
                                <Outlet />
                            </main>
                        </div>
                    </div>
                ) : <Navigate to="/" />}

        </>
    )
}
