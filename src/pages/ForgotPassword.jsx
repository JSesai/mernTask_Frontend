import { useState } from "react"
import { Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta"

export default function ForgotPassword() {
  const [email, setEmail] = useState(""); //estate que almacena el email que el usuario ingresa
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async e=> {
    e.preventDefault(); //prenimos envio por default
    //validacion de state email y vacio
    if(email === '' || email.length < 6 ){
      setAlerta({
        msg: "El Email Es Obligatorio",
        error: true
      })
      return
    }
    try {
      //hacemos peticion post y extraemos lo que devuelve como respuesta en data
      const { data } = await clienteAxios.post(`/usuarios/olvide-password`, {email});
      setAlerta({
        msg: data.msg,
        error: false
      })
    } catch (error) {
      //cacha el error y extrae el mensaje que viene del back en response por eso error.respose.data.msg
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      
    }
  }


  return (
    <>
      <h1 className="text-sky-600 font-black text-5xl capitalize">Recupera tu acceso y no pierdas tus {' '} <span className="text-slate-700">Archivos</span> </h1>
      
      {/* {alerta.msg && <Alerta alerta={alerta} />} */}
      
      <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">

        <div className="my-5 ">

          <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

        </div>

        <input type="submit" value="Enviar Instrucciones" className="bg-sky-700 w-full mb-5 py-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />

      </form>

      <nav className="lg:flex lg:justify-between">
        <Link className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >¿Ya tienes una cuenta? Inicia Sesión</Link>

        <Link className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/registrar"
        >¿no tienes una cuenta? registrate</Link>
      </nav>

    </>
  )
}
