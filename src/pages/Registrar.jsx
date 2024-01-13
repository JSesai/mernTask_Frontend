import { useState } from "react"
import { Link } from "react-router-dom"
import { Alerta } from "../index";
import clienteAxios from "../config/clienteAxios";


export default function Registrar() {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    //metemos en un array los estates para poder usar el metodo includes y evaluar que ninguno incluya valor vacio
    if ([nombre, email, password, repetirPassword].includes('')) {
      setAlerta({
        msg: 'todos los campos son obligatorios',
        error: true
      });
      return
    }
    //comprueba si password y repetir password no son iguales 
    if (password !== repetirPassword) {
      setAlerta({
        msg: 'Los passwords no son iguales',
        error: true
      });
      return
    }

    //comprueba si la password es menor a 6 caracteres
    if(password.length < 6){
      setAlerta({
        msg: 'El password es muy corto, agrega minimo 6 caracteres',
        error: true
      });
      return
    }
    //si pasa las valdaciones seteamos la alerta a objeto vacio para que sea false y no se muestre la alerta
    setAlerta({});
    
    //enviamos la peticion al backend con ayuda de axios
    try {
      //hacemos uso de la baseurl que esta en cliente axios
      const { data } = await clienteAxios.post(`/usuarios`, {nombre, email, password}); //peticion post pasa primer parametro la url, segundo parametro lo que envia en este caso enviamos un objeto con los datos necesarios para hacer un nuevo registro
      //seteamos la alerta para mostrar el mensaje retornado del back
      setAlerta({
        msg: data.msg,
        error: false
      })
      //seteamos los inputs a campos vacios
      setNombre('');
      setEmail('');
      setPassword('');
      setRepetirPassword('');
      
    } catch (error) {
      //en caso de ocurrir un error lo cachamos con axios con ayuda de error.response
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      
    }
  }

  //extraemos el mensaje para hacer renderizado condicional si no esta vacio sera true
  const { msg } = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-5xl capitalize">crea tu cuenta y administra tus {' '} <span className="text-slate-700">proyectos</span> </h1>
      {msg && <Alerta alerta={alerta} />}
      <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>

        <div className="my-5 ">
          <label htmlFor="nombre" className="uppercase text-gray-600 block text-xl font-bold">Nombre</label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu Nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

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

        <div className="my-5 ">
          <label htmlFor="password2" className="uppercase text-gray-600 block text-xl font-bold">Repetir Password</label>
          <input
            id="password2"
            type="password"
            placeholder="Repetir tu Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={repetirPassword}
            onChange={e => setRepetirPassword(e.target.value)}
          />
        </div>

        <input type="submit" value="Crear Cuenta" className="bg-sky-700 w-full mb-5 py-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />

      </form>

      <nav className="lg:flex lg:justify-between">
        <Link className="block text-center my-5 text-slate-500 uppercase text-sm" to="/">
          ¿Ya tienes una cuenta? Inicia Sesión</Link>

        <Link className="block text-center my-5 text-slate-500 uppercase text-sm" to="/olvide-password">
          olvide mi password</Link>
      </nav>

    </>
  )
}
