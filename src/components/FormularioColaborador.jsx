import { useEffect, useState } from "react"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"

export default function FormularioColaborador() {
    const [email, setEmail] = useState('')    
    const {mostrarAlerta, alerta, submitColaborador} = useProyectos()

   
    const handleSubmit = e => {
        e.preventDefault()

        if (email === '') {
            console.log('campos vacios !!');
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }
        submitColaborador(email)

    }
    
    return (
        <form onSubmit={handleSubmit} className="bg bg-white py-10 px-5 md:w-3/4 rounded-lg shadow w-full">
            {alerta.msg && <Alerta alerta={alerta} />}
            <div className="mb-5">

                <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='email'>
                    Email Colaborador
                </label>
                <input
                    type="email"
                    id='email'
                    placeholder='Email del Usario'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

            </div>
            <input
                type="submit"
                value="Buscar Colaborador"
                className=' text-sm bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded'
            />
        </form>
    )
}
