$('#formulary').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        url: '/',
        data: $('form').serialize(),
        type: 'POST',
        success: function (data) {
            passwordSecure();
        },
        error: function () {
            passwordInsecure();
        }
    });
});
function passwordSecure() {
    Swal.fire({
        title: "¡Ganaste, Completaste El Juego!",
        html: `
        <img class="img-fluid" src="../static/img/ganaste.png" alt="Ganaste">
        <p class="h4">Muy bien hecho</p>`,
        confirmButtonText: "Jugar de nuevo",
        allowOutsideClick: false,
        allowEscapeKey: false,
    })
};
function passwordInsecure() {
    swal({
        title: 'Contraseña insegura',
        text: 'Tu contraseña no es segura, prueba de nuevo',
        icon: 'warning'
    })
};
$(document).ready(function (){
    $('#btnInfo').click(function(){
        swal({
            title: '¿Cómo debería ser?',
            text: 'La contraseña debe contener una letra mayúscula, seguido de 3 números, luego letras minúsculas ' +
                  'y por último 3 carácteres especiales.',
            icon: 'info'
          })
    });
});