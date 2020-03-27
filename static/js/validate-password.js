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
    swal({
        title: 'Contraseña segura',
        text: 'Tu contraseña es segura',
        icon: 'success'
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