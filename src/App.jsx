import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login, AuthLayout, Registrar, OlvidePassword, NuevoPassword, ConfirmarCuenta, RutaProtegida, Proyectos, NuevoProyecto, Proyecto, EditarProyecto, NuevoColaborador } from "./index";
import { AuthProvider } from "./context/AuthProvider";
import { ProyectosProvider } from "./context/ProyectosProvider";

function App() {

  return (
    <BrowserRouter>
      <AuthProvider> {/*AuthProvider es el context, rodea a las rutas para que tengan acceso a la informacion del contexto global */}
        <ProyectosProvider> {/*ProyectosProvider da acceso al context, rodea a las rutas para que tengan acceso a la informacion del contexto global */}

          <Routes>
            {/* rutas de area publica */}
            <Route path="/" element={<AuthLayout />}> {/* Ruta padre contiene a mas rutas que en este caso son publicas e hijas  y */}
              <Route index element={<Login />} /> {/* Ruta principal */}
              <Route path="registrar" element={<Registrar />} /> {/* Ruta para registrar usuario */}
              <Route path="olvide-password" element={<OlvidePassword />} /> {/* Ruta para cuando olviden su password */}
              <Route path="olvide-password/:token" element={<NuevoPassword />} /> {/* Ruta dinamica para poder leer el token y definir nueva contraseña */}
              <Route path="confirmar/:id" element={<ConfirmarCuenta />} /> {/* Ruta dinamica para poder leer el id y confirmar cuenta */}
            </Route>

            {/* rutas de area protegida envulta por la ruta padre con el componente RutaProtegida que envuelve las rutas hijas*/}
            <Route path="/proyectos" element={<RutaProtegida />}>
              <Route index element={<Proyectos />} />
              <Route path="crear-proyecto" element={<NuevoProyecto />} />
              <Route path="nuevo-colaborador/:id" element={<NuevoColaborador />} />
              <Route path=":id" element={<Proyecto />} />
              <Route path="editar/:id" element={<EditarProyecto />} />



            </Route>



          </Routes>
        </ProyectosProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
