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
    Swal.fire(
        'Contraseña segura',
        'Tu contraseña es segura',
        'success'
    )
};
function passwordInsecure() {
    Swal.fire(
        'Contraseña insegura',
        'Tu contraseña no es segura, prueba de nuevo',
        'warning'
    )
};
$(document).ready(function (){
    $('#btnInfo').click(function(){
        Swal.fire(
            'Cómo debe ser?',
            'Introduzca una letra mayúscula seguida de 3 números, luego'+
            ' añada letras minúsculas y por último 3 carácteres especiales',
            'question',
        )
    });
    $('#btnJuego').click(function(){
        Swal.fire(
            '¿Cómo jugar?',
            'Haz click en las diferentes incognitas hasta que encuentres '+
            'un par de imágenes iguales hasta finalizar',
            'question',
        )
    });
});
