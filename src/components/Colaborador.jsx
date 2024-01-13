import React from 'react'
import useProyectos from '../hooks/useProyectos';

export default function Colaborador({colaborador}) {
    const { nombre, email } = colaborador;
    const { handleEliminarColaborador } = useProyectos();

  return (
    <div className='border-b p-5 flex justify-between items-center'>
      <div>
        <p>{nombre}</p>
        <p className='text-sm text-gray-700'>{email}</p>
      </div>

      <div>
        <button
        type='button'
        className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
        onClick={()=> handleEliminarColaborador(colaborador)}
        >Eliminar</button>
      </div>
    </div>
  )
}
