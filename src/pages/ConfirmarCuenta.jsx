import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";

export default function ConfirmarCuenta() {

  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
  const params = useParams(); //detecta lo que llega por url



  const confirmarCuenta = async () => {
    const { id } = params; //extraemos lo que llega por url
    try {
      const { data } = await clienteAxios(`/usuarios/confirmar/${id}`); // envio de peticion get se puede usar axios.get pero por default es get por lo que no es necesario especificar, se pasa  url destino el cual lleva en la url el token para que en el backend se confirme la cuenta
      setAlerta({ //seteamos el estate y le pasamos las propiedades msg y error en false porque se hizo correctamente la peticion
        msg: data.msg,
        error: false
      })
      setCuentaConfirmada(true); //seteamos a true el estate para el renderizado condicional

    } catch (error) {
      setAlerta({ //seteamos el estate y le pasamos las propiedades msg y error en true porque hubo un error al hacer la confirmacion de la cuenta
        msg: error.response.data.msg,
        error: true
      })
      setCuentaConfirmada(false);
    }

  }
  return (
    <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">

      <h1 className="text-sky-600 font-black text-5xl capitalize">confirma tu cuenta y comienza a crear tus {' '} <span className="text-slate-700">proyectos</span> </h1>
        {/* si alerta no tiene la propiedad msg se muestra el boton si la tiene se muestra la alerta */}
      {alerta.msg ? (<Alerta alerta={alerta} />) : (<button onClick={confirmarCuenta} className="bg-sky-700 w-full my-20 py-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-800 transition-colors ">Confirmar Ahora</button>)}
      
      {/* si cuenta confirmada es true se muesta el enlace para iniciar sesion */}
      {cuentaConfirmada && (
        <Link className="block text-center my-5 text-slate-600 uppercase text-lg" to="/">
          Iniciar Sesión
        </Link>
      )}

    </div>
  )
}
