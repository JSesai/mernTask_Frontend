import { Link } from 'react-router-dom';

export default function NotFound() {

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="max-w-lg p-8 bg-white rounded-lg shadow-lg text-center relative">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700">Página No Encontrada</h2>
                <p className="text-gray-600 mt-4">
                    Lo sentimos, la página que estás buscando no existe.
                </p>
                <Link
                    to="/"
                    className="inline-block mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
                >
                    Volver a Inicio
                </Link>
            </div>
        </div>
    );
}





