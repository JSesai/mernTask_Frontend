export const formatearFecha = fecha => {

    const nuevaFecha = new Date(fecha.split('T')[0].split('-')) //creamos la fecha pasando la fecha y haciendo un split en T luego tomando la primera parte [0] y despues separando por - cada parte debido a que si no se hace toma una fecha erronea esto por el api de Date
    //opciones de formato de fecha 
    const opciones = {
        weekday: 'long', //nombre completo del dia de la semana
        year: 'numeric', //año en formato numerico
        month: 'long', //nombre completo del mes completo
        day: 'numeric' //dia en numero
    }

    //retornamos la fecha con el formato definido
    return nuevaFecha.toLocaleDateString('es-ES', opciones);

}