import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { clienteAxios } from "../index"
import useAuth from "../hooks/useAuth"; //fn hook propio que nos permite acceder a nuestro context de autenticacion AuthContext

export default function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //extraer del context
  const { setAuth, showAlert, navigate } = useAuth();

  //envio de petiicon para loguin
  const handleSubmit = async e => {
    e.preventDefault();//evita envio por default
    if ([email, password].includes('')) { //valida si estan vacios email y password    
      showAlert({
        typeAlert: 'error',
        title: 'Faltan datos',
        message: 'Debes ingresar Usuario y Contraseña',     
      })
      return
    }
    
    try { 
      showAlert({typeAlert: 'loading'})
      //enviamos datos para validar loguin
      const { data } = await clienteAxios.post('/users/login', { email, password });
     
      console.log(data);
      //almacenamos el LS el token que es JWT que contiene el id del usuario
      localStorage.setItem('token', data.user.token);
      //guardamos la informacion data en el context
      const user = {
        _id: data.user.id,
        name: data.user.nombre,
        email: data.user.email
      }
      setAuth(user);
      //navegamos a proyectos
      showAlert({
        typeAlert: 'closeAlert',
        callbackAcept: () => navigate('/files')
      })
     
    } catch (error) {
      console.log(error);

      let message = error.response?.data?.message || 'Ocurrio un error intentalo más tarde si el problema persiste contacte a soporte técnico.'
      showAlert({
        typeAlert: 'error',
        title: 'Error al iniciar sesión',
        message: message,
      })
    
    }

  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-4xl capitalize">Inicia sesión y administra tus {' '} <span className="text-slate-700">Viajes</span> </h1>
     
      <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-5">

        <div className="my-5 ">
          <label htmlFor="email" className="uppercase text-gray-600 block text-lg font-bold">Email</label>
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
          <label htmlFor="password" className="uppercase text-gray-600 block text-lg font-bold">Password</label>
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
