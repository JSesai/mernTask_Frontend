import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
export default function AlertMessage({
    typeAlert,
    message,
    title,
    btnAccept = 'Aceptar',
    btnCancel = 'Cancelar',
    callbackAcept,
    callbackCancel
}) {

    switch (typeAlert) {
        case 'loading':

            MySwal.fire({
                title: title || 'Cargando...',
                text: title || 'Por favor espera mientras procesamos tu solicitud.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    MySwal.showLoading();
                }
            });
            break;

        case ('success'):
            MySwal.fire({
                icon: 'success',
                title: title || '¡Acción exitosa 🎉!',
                text: message || 'La operación se completó correctamente.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: btnAccept,
            }).then((result) => {
                console.log(result);
                if (result.isConfirmed && callbackAcept) callbackAcept();
            });
            break;

        case ('error'):
            MySwal.fire({
                icon: 'error',
                title: title || 'Oops...',
                text: message || 'Ocurrio un error',
                confirmButtonColor: "#3085d6",
                confirmButtonText: btnAccept,
            }).then((result) => {
                console.log(result);
                if (result.isConfirmed && callbackAcept) callbackAcept();
            });
            break;

        case ('confirm'):
            MySwal.fire({
                icon: 'warning',
                title: title || '¡Confirma!',
                text: message || 'Estas seguro de realizar esta acción',
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                showCancelButton: true,
                confirmButtonText: btnAccept,
                cancelButtonText: btnCancel,
            }).then((result) => {
                console.log(result);
                if (result.isConfirmed && callbackAcept) callbackAcept();
                if (!result.isConfirmed && callbackCancel) callbackCancel();
            });
            break;

        case ('closeAlert'):
            MySwal.close();
            if (callbackAcept) callbackAcept();
            break;

        case ('loaderBackground'):
            MySwal.fire({
                title: "...",
                width: 600,
                padding: "3em",
                color: "#716add",
                background: "#fff url(https://sweetalert2.github.io/#handling-dismissalsimages/trees.png)",
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("https://sweetalert2.github.io/#handling-dismissalsimages/nyan-cat.gif")
                  left top
                  no-repeat
                `
            });
            break

        // case ('snackBarSuccess'):

        default:
            MySwal.fire({
                icon: 'error',
                title: 'Revisa el typeAlert ',
                text: `${typeAlert}  no coincede con ningun case`,
                confirmButtonColor: "#3085d6",
                confirmButtonText: btnAccept,
            })
            break;
    }



}

