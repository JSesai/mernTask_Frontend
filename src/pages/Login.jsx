import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Alerta, clienteAxios } from "../index"
import useAuth from "../hooks/useAuth"; //fn hook propio que nos permite acceder a nuestro context de autenticacion AuthContext

export default function Login() {
  //Estates para correo, contraseña, alerta
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState({});

  //hacemos destructuring para extraer la fn que nos permite agregar al context 
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();//evita envio por default
    if ([email, password].includes('')) { //valida si estan vacios email y password
      setAlerta({ //setea alerta con el mensage y error en true
        msg: "Ingresa Usuario y Contraseña",
        error: true,
      })
      return
    }

    //enviamos datos para validar loguin
    try { //lo que esta entry se ejecuta si todo sale bien
      //extraemos data de la respuesta de la peticion, que viene del back 
      const { data } = await clienteAxios.post('/usuarios/login', { email, password });
      setAlerta({});
      console.log(data);
      //almacenamos el LS el token que es JWT que contiene el id del usuario
      localStorage.setItem('token', data.token);
      //guardamos la informacion data en el context
      setAuth(data);
      //navegamos a proyectos
      navigate("/proyectos");
    } catch (error) {
      console.log(error);
      if (error.message) {
        setAlerta({
          msg: error.message,
          error: true
        })
      }

      if (error.response.data.msg) {

        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }

  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-5xl capitalize">Inicia sesión y administra tus {' '} <span className="text-slate-700">proyectos</span> </h1>
      {alerta.msg && <Alerta alerta={alerta} />}
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

        <div className="my-5 ">
          <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <input type="submit" value="Iniciar Sesión" className="bg-sky-700 w-full mb-5 py-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />

      </form>

      <nav className="lg:flex lg:justify-between">
        <Link className="block text-center my-5 text-slate-500 uppercase text-sm" to="/registrar">
          ¿no tienes una cuenta? registrate</Link>

        <Link className="block text-center my-5 text-slate-500 uppercase text-sm" to="/olvide-password">
          olvide mi password</Link>
      </nav>

    </>
  )
}
