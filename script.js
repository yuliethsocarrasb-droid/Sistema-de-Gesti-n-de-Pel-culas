// Array principal de películas
let peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];

// Referencias HTML
const formulario = document.getElementById("formPelicula");
const tabla = document.getElementById("tablaPeliculas");
const contador = document.getElementById("contador");

const titulo = document.getElementById("titulo");
const director = document.getElementById("director");
const anio = document.getElementById("anio");
const categoria = document.getElementById("categoria");
const idPelicula = document.getElementById("idPelicula");

const buscar = document.getElementById("buscar");
const filtroCategoria = document.getElementById("filtroCategoria");

// Mostrar películas al iniciar
mostrarPeliculas();

// Evento guardar
formulario.addEventListener("submit", function(e){

    e.preventDefault();

    if(!validarFormulario()){
        return;
    }

    const pelicula = {
        id: Date.now(),
        titulo: titulo.value,
        director: director.value,
        anio: anio.value,
        categoria: categoria.value
    };

    // Editar
    if(idPelicula.value){

        const indice = peliculas.findIndex(
            p => p.id == idPelicula.value
        );

        peliculas[indice] = {
            id: Number(idPelicula.value),
            titulo: titulo.value,
            director: director.value,
            anio: anio.value,
            categoria: categoria.value
        };

        idPelicula.value = "";

    }else{

        peliculas.push(pelicula);
    }

    guardarLocalStorage();
    formulario.reset();
    mostrarPeliculas();

});

// Validaciones
function validarFormulario(){

    if(titulo.value.trim().length < 2){
        alert("El título debe tener mínimo 2 caracteres");
        return false;
    }

    if(director.value.trim().length < 3){
        alert("El director debe tener mínimo 3 caracteres");
        return false;
    }

    let año = Number(anio.value);

    if(año < 1900 || año > 2026){
        alert("Ingrese un año válido");
        return false;
    }

    if(categoria.value === ""){
        alert("Seleccione una categoría");
        return false;
    }

    return true;
}

// Mostrar registros
function mostrarPeliculas(){

    tabla.innerHTML = "";

    let textoBusqueda = buscar.value.toLowerCase();
    let categoriaFiltro = filtroCategoria.value;

    let peliculasFiltradas = peliculas.filter(p => {

        let coincideTitulo =
            p.titulo.toLowerCase().includes(textoBusqueda);

        let coincideCategoria =
            categoriaFiltro === "Todas" ||
            p.categoria === categoriaFiltro;

        return coincideTitulo && coincideCategoria;
    });

    peliculasFiltradas.forEach(pelicula => {

        tabla.innerHTML += `
        <tr>
            <td>${pelicula.titulo}</td>
            <td>${pelicula.director}</td>
            <td>${pelicula.anio}</td>
            <td>${pelicula.categoria}</td>
            <td>
                <button class="btnEditar"
                onclick="editarPelicula(${pelicula.id})">
                Editar
                </button>

                <button class="btnEliminar"
                onclick="eliminarPelicula(${pelicula.id})">
                Eliminar
                </button>
            </td>
        </tr>
        `;
    });

    contador.textContent = peliculasFiltradas.length;
}

// Editar
function editarPelicula(id){

    const pelicula = peliculas.find(
        p => p.id === id
    );

    titulo.value = pelicula.titulo;
    director.value = pelicula.director;
    anio.value = pelicula.anio;
    categoria.value = pelicula.categoria;

    idPelicula.value = pelicula.id;
}

// Eliminar
function eliminarPelicula(id){

    if(confirm("¿Desea eliminar esta película?")){

        peliculas = peliculas.filter(
            pelicula => pelicula.id !== id
        );

        guardarLocalStorage();
        mostrarPeliculas();
    }
}

// Guardar en localStorage
function guardarLocalStorage(){

    localStorage.setItem(
        "peliculas",
        JSON.stringify(peliculas)
    );
}

// Búsqueda en tiempo real
buscar.addEventListener("keyup", mostrarPeliculas);

// Filtro por categoría
filtroCategoria.addEventListener("change", mostrarPeliculas);