
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
export default function PreviewProyecto({ proyecto }) {
    const { auth } = useAuth();
    const { _id, nombre, cliente, creador } = proyecto;


    return (
        <div className="flex flex-col md:flex-row p-5 border-b justify-between">

            <div className="flex items-center gap-4 ">
                <p className="flex-1">
                    {nombre}
                    <span className="text-sm text-gray-500 uppercase">{' '} {cliente}</span>
                </p>
                <p className={`${creador == auth?._id ? 'bg-violet-500' : 'bg-green-500'} p-1 text-xs rounded-lg text-white`}>{creador == auth?._id ? 'admin' : 'colaborador'}</p>

            </div>
            <Link
                to={`${_id}`}
                className="text-gray-600 hover:text-gray-800 uppercase text-sm font-bold"
            >Ver producto</Link>
        </div>
    )
}
