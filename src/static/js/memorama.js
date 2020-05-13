const max_intentos = 10;
const columnas = 4;
const espera = 1.4;
const imagen_oculta = "../static/img/interrogacion.jpg";

new Vue({
    el: "#memorama",
    data: () => ({
        // La ruta de las imágenes. Puede ser relativa o absoluta
        imagenes: [
            "../static/img/cartuchos_tinta.jpg",
            "../static/img/memoria_ram.jpg",
        ],
        imagenes2: [
            "../static/img/rodillos.jpg",
            "../static/img/tarjeta_de_sonido.jpg",
            "../static/img/tarjeta_madre.jpg",
        ],
        imagenes3: [
            "../static/img/tarjeta_de_video.jpg",
            "../static/img/tonerimpresora.jpg",
            "../static/img/ventilador.jpg",
            "../static/img/cartuchos_tinta.jpg",
            "../static/img/memoria_ram.jpg",
            "../static/img/tarjeta_de_sonido.jpg",
        ],
        memorama: [],
        // Útiles para saber cuál fue la carta anteriormente seleccionada
        ultimasCoordenadas: {
            indiceFila: null,
            indiceImagen: null,
        },
        coordenadas: {
            coordenadaX: null,
            coordenadaY: null
        },
        imagen_oculta: imagen_oculta,
        max_intentos: max_intentos,
    
        intentos: 0,
        aciertos: 0,
        nivel: 0,
        esperandoTimeout: false,
        tiempo: false
    }),
    methods: {
        comoJugar() {
            Swal.fire({
                title: "¿Cómo Jugar?",
                html: `No lo sé, tú dime.`,
                confirmButtonText: "Cerrar",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        },
        desordenarImagenes(imagen) {
            var j, x, i;
            for (i = imagen.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = imagen[i];
                imagen[i] = imagen[j];
                imagen[j] = x;
            }
            return imagen;
        },
        jugar(imagenes) {
            let memorama = [];
            imagenes.forEach((imagen) => {
                let imagenDeMemorama = {
                    ruta: imagen,
                    mostrar: false, // No se muestra la original
                    acertada: false, // No es acertada al inicio
                };
                memorama.push(imagenDeMemorama, Object.assign({}, imagenDeMemorama));
            });
            // Las imágenes quedarán aleatorias.
            this.desordenarImagenes(memorama);

            // Dividirlo en subarreglos o columnas
            let memoramaDividido = [];
            for (let i = 0; i < memorama.length; i += 4) {
                memoramaDividido.push(memorama.slice(i, i + 4));
            }
            // Reiniciar intentos
            this.intentos = 0;
            this.aciertos = 0;
            // Asignar a instancia de Vue para que lo dibuje
            this.memorama = memoramaDividido;
        },
        // Método que precarga las imágenes para que las mismas ya estén cargadas
        // cuando el usuario gire la tarjeta
        cargarImagenes(imagenes) {
            // Mostrar la alerta
            Swal.fire(
                'Imágenes',
                'Cargando imágenes',
                'success',
            ).then(this.jugar(imagenes))
                // Ponerla en modo carga


            let total = this.imagenes.length;
            let contador = 0;
            let imagenesPrecarga = Array.from(imagenes);
            // También vamos a precargar la "espalda" de la tarjeta
            imagenesPrecarga.push(imagen_oculta);
            // Cargamos cada imagen y en el evento load aumentamos el contador
            imagenesPrecarga.forEach(ruta => {
                const imagen = document.createElement("img");
                imagen.src = ruta;
                imagen.addEventListener("load", () => {
                    contador++;
                    if (contador >= total) {
                        // Si el contador >= total entonces se ha terminado la carga de todas
                        this.jugar(imagenes);
               
                    }
                });
                // Agregamos la imagen y la removemos instantáneamente, así no se muestra
                // pero sí se carga
                document.body.appendChild(imagen);
                document.body.removeChild(imagen);
            });
        },
        voltear(coordenadaX, coordenadaY) {
            if(this.tiempo) {
                return;
            }
            if(this.memorama[coordenadaX][coordenadaY].acertada) {
                return;
            }
            if(this.coordenadas.coordenadaX === null && this.coordenadas.coordenadaY === null) {
                this.memorama[coordenadaX][coordenadaY].mostrar = true;
                this.coordenadas.coordenadaX = coordenadaX;
                this.coordenadas.coordenadaY= coordenadaY;
                return;
            }
            let imagenInicial = this.memorama[coordenadaX][coordenadaY];
            let imagenFinal = this.memorama[this.coordenadas.coordenadaX][this.coordenadas.coordenadaY];
            if(coordenadaX === this.coordenadas.coordenadaX && coordenadaY === this.coordenadas.coordenadaY) {
                this.memorama[coordenadaX][coordenadaY].mostrar = false;
                this.coordenadas.coordenadaX = null;
                this.coordenadas.coordenadaY = null;
                this.numeroDeIntentos();
                return;
            }
            this.memorama[coordenadaX][coordenadaY].mostrar = true;
            if(imagenInicial.ruta === imagenFinal.ruta) {
                this.aciertos++;
                this.memorama[coordenadaX][coordenadaY].acertada = true;
                this.memorama[this.coordenadas.coordenadaX][this.coordenadas.coordenadaY].acertada = true;
                this.coordenadas.coordenadaX = null;
                this.coordenadas.coordenadaY = null;
                document.getElementById('aciertos').innerHTML = this.aciertos;
                //Cada que acierta comprobamos si ha ganado
                if (this.ganador()) {
                    this.gameWin();
                } 
            } else {
                // Si no acierta, entonces giramos ambas imágenes
                this.time = true;
                setTimeout(() => {
                    this.memorama[coordenadaX][coordenadaY].mostrar = false;
                    this.memorama[coordenadaX][coordenadaY].animacion = false;
                    this.memorama[this.coordenadas.coordenadaX][this.coordenadas.coordenadaY].mostrar = false;
                    this.coordenadas.coordenadaX = null;
                    this.coordenadas.coordenadaY = null;
                    this.tiempo = false;
                }, espera * 1000);
                this.numeroDeIntentos();
            }
        },
        numeroDeIntentos() {
            this.intentos++;
            document.getElementById('intentos').innerHTML = this.intentos + ' de 10';
            if (this.intentos >= max_intentos) {
                this.gameOver();
            }
        },
        ganador() {
            return this.memorama.every(arreglo => arreglo.every(imagen => imagen.acertada));
        },
        gameOver() {
            setTimeout(() => {
                Swal.fire({
                    title: "Perdiste",
                    html: `
                <img class="img-fluid" src="../static/img/perdiste.png" alt="Perdiste">
                <p class="h4">Agotaste tus intentos</p>`,
                    confirmButtonText: "Jugar de nuevo",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                })
                .then(this.jugar(this.imagenes));
            }, espera * 2000);
            this.nivel = 0;
        },
        gameWin() {
            this.nivel++;
            if(this.nivel == 1){
                setTimeout(() => {
                    Swal.fire({
                        title: "¡Ganaste!",
                        html: `
                    <img class="img-fluid" src="../static/img/ganaste.png" alt="Ganaste">
                    <p class="h4">Muy bien hecho</p>`,
                        confirmButtonText: "Próximo Nivel",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    })
                    .then(this.jugar(this.imagenes2));
                }, espera * 2000);  
                this.intentos = 0;            
            } 
            if(this.nivel == 2) {
                setTimeout(() => {
                    Swal.fire({
                        title: "¡Ganaste!",
                        html: `
                    <img class="img-fluid" src="../static/img/ganaste.png" alt="Ganaste">
                    <p class="h4">Muy bien hecho</p>`,
                        confirmButtonText: "Próximo Nivel",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    })
                    .then(this.jugar(this.imagenes3));
                }, espera * 2000);
                this.intentos = 0;
            } 
            if(this.nivel == 3) {
                setTimeout(() => {
                    Swal.fire({
                        title: "¡Ganaste, Completaste El Juego!",
                        html: `
                    <img class="img-fluid" src="../static/img/ganaste.png" alt="Ganaste">
                    <p class="h4">Muy bien hecho</p>`,
                        confirmButtonText: "Jugar de nuevo",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    })
                    .then(this.jugar(this.imagenes));
                }, espera * 2000);
                this.nivel = 0;
            }
            this.intentos = 0;
        },        
    },
    mounted() {
        this.cargarImagenes(this.imagenes);
    },
});