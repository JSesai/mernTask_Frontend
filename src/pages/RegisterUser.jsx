import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios";
import useAuth from "../hooks/useAuth"


export default function RegisterUser() {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');

  const { showAlert, navigate } = useAuth()
  
  
   const handleSubmit = async (e) => {
    e.preventDefault();
    //metemos en un array los estates para poder usar el metodo includes y evaluar que ninguno incluya valor vacio
    if ([nombre, email, password, repetirPassword].includes('')) {

      showAlert({
        title: 'Faltan datos 😥',
        typeAlert: 'error',
        message: 'Todos los campos son obligatorios',
      });
      return
    }
    //comprueba si password y repetir password no son iguales 
    if (password !== repetirPassword) {
      showAlert({
        title: 'Revisa  tus passwords 😥',
        typeAlert: 'error',
        message: 'Los passwords ingresados no son iguales',
      });
      return
    }

    //comprueba si la password es menor a 6 caracteres
    if (password.length < 6) {
      showAlert({
        title: 'El password es muy corto 😥',
        typeAlert: 'error',
        message: 'Debe ser  mayor a 6 caracteres',
      });
      return
    }

    //enviamos la peticion al backend con ayuda de axios
    try {
      showAlert({
        typeAlert: 'loading'
      })
      //hacemos uso de la baseurl que esta en cliente axios
      const { data } = await clienteAxios.post('/users', { nombre, email, password }); //peticion post pasa primer parametro la url, segundo parametro lo que envia en este caso enviamos un objeto con los datos necesarios para hacer un nuevo registro
      
      //seteamos los inputs a campos vacios
      setNombre('');
      setEmail('');
      setPassword('');
      setRepetirPassword('');
      
      //seteamos la alerta para mostrar el mensaje retornado del back
      console.log(data);
      showAlert({
        typeAlert: 'success',
        message: data.message,
        callbackAcept: () => navigate('/')
      })

    } catch (error) {
      console.log(error);
      let message = error.response.data.message || 'Ocurrio un error intentalo más tarde si el problema persiste contacte a soporte técnico.'
      //en caso de ocurrir un error lo cachamos con axios con ayuda de error.response
      showAlert({
        typeAlert: 'error',
        message,
      })
    }
  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-3xl capitalize">crea tu cuenta y administra tus {' '} <span className="text-slate-700">Archivos</span> </h1>

      <form className="my-4 bg-white shadow rounded-lg p-7" onSubmit={handleSubmit}>

        <div className="my-1">
          <label htmlFor="nombre" className="uppercase text-gray-600 block text-sm font-bold">Nombre</label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu Nombre"
            className="w-full mt-2 p-2 border rounded-lg bg-gray-50"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        <div className="my-2 ">
          <label htmlFor="email" className="uppercase text-gray-600 block text-sm font-bold">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full mt-2 p-2 border rounded-lg bg-gray-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="my-2 ">
          <label htmlFor="password" className="uppercase text-gray-600 block text-sm font-bold">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="w-full mt-2 p-2 border rounded-lg bg-gray-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="my-2 ">
          <label htmlFor="password2" className="uppercase text-gray-600 block text-sm font-bold">Repetir Password</label>
          <input
            id="password2"
            type="password"
            placeholder="Repetir tu Password"
            className="w-full mt-2 p-2 border rounded-lg bg-gray-50"
            value={repetirPassword}
            onChange={e => setRepetirPassword(e.target.value)}
          />
        </div>

        <input type="submit" value="Crear Cuenta" className="bg-sky-700 w-full mb-5 py-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />

      </form>

      <nav className="lg:flex lg:justify-between">
        <Link className="block text-center my-2 text-slate-500 uppercase text-sm" to="/">
          ¿Ya tienes una cuenta? Inicia Sesión</Link>

        <Link className="block text-center my-2 text-slate-500 uppercase text-sm" to="/olvide-password">
          olvide mi password</Link>
      </nav>

    </>
  )
}
