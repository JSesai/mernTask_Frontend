import { useParams } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import useAuth from "../hooks/useAuth"

export default function ConfirmAccount() {

  const params = useParams(); //detecta lo que llega por url
  const { showAlert, navigate } = useAuth();


  const comfirmAccount = async () => {
    const { id } = params; //extraemos lo que llega por url

    try {
      showAlert({ typeAlert: 'loading' })
      const { data } = await clienteAxios(`/users/confirm-account/${id}`); // envio de peticion get se puede usar axios.get pero por default es get por lo que no es necesario especificar, se pasa  url destino el cual lleva en la url el token para que en el backend se confirme la cuenta
      
      showAlert({
        typeAlert: 'success',
        title: `${data.message} 👍`,
        message: 'Ya puedes iniciar sesión 🥳',
        callbackAcept: () => navigate('/'),
        callbackCancel: () => navigate('/'),
      })

    } catch (error) {
      showAlert({
        typeAlert: 'error',
        title: 'Error al confirmar cuenta',
        message: error?.response?.data?.msg || '',
      })
     
    }

  }
  return (
    <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">

      <h1 className="text-sky-600 font-black text-3xl capitalize">confirma tu cuenta y comienza a crear tus {' '} <span className="text-slate-700">Archivos</span> </h1>
      <button onClick={comfirmAccount} className="bg-sky-700 w-full my-20 py-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-800 transition-colors ">Confirmar Ahora</button>
    
    </div>
  )
}
