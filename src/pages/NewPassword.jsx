
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";


export default function NewPassword() {
  const [alerta, setAlerta] = useState({});
  const [password, setPassword] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [passwordModificado, setPasswordModificado] = useState(false);
  const params = useParams();
  const { token } = params;

  //comprueba el token sea valido haciendo una peticion get
  const comprobarToken = async () => {
    try {
      await clienteAxios(`/usuarios/olvide-password/${token}`);
      setTokenValido(true);

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })


    }
  }

  //submit del form, envia nuevo passwors haciendo peticion post
  const handleSubmit = async e => {
    e.preventDefault();
    if(password.length < 6){
      setAlerta({
        msg: 'El Password debe ser minimo de 6 caracteres',
        error: true
      })
      return
    }

    try {
      //hacemos peticion post y extraemos lo que devuelve como respuesta en data
      const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}`, {password});
    setAlerta({
      msg: data.msg,
      error: false
    })
    setPasswordModificado(true);

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }


  }
  return (
    <>
      <h1 className="text-sky-600 font-black text-5xl capitalize">reestablece tu password y no pierdas acceso a tus {' '} <span className="text-slate-700">Archivos</span> </h1>
      {/* {alerta.msg && <Alerta alerta={alerta} />} */}
      
      {tokenValido  ? (<form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">

          <div className="my-5 ">
            <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Nuevo Password</label>
            <input
              id="password"
              type="password"
              placeholder="Escribe tu Nuevo Password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>


          <input type="submit" value="Guardar Nuevo Password" className="bg-sky-700 w-full mb-5 py-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />

        </form>) :(
          <button onClick={comprobarToken} className="bg-sky-700 w-full my-20 py-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-800 transition-colors ">Reestablecer Password Ahora</button>
        )
           
      }
      {/* si passwordModificado es true se muesta el enlace para iniciar sesion */}
      {passwordModificado && (
        <Link className="block text-center my-5 text-slate-600 uppercase text-lg" to="/">
          Inicia Sesión
        </Link>
      )}



    </>
  )
}
