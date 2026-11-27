const API = "https://dog.ceo/api";

// Estados
let imagenes = [];
let razas = [];
let razaElegida = "";
let cargando = false;
let error = null;
let controlador = null;      // para cancelar peticiones viejas
let ultimaAccion = null;     // para el botón Reintentar
let listaPintada = null;

// Elementos
const selector = document.getElementById("selector-raza");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");
const galeria = document.getElementById("galeria");
const btnMas = document.getElementById("btn-mas");

// ---------- Utilidades ----------
function mayuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function nombreRaza(url) {
  return url.split("breeds/")[1].split("/")[0].replace("-", " ");
}

function urlImagenes(n) {
  return razaElegida
    ? `${API}/breed/${razaElegida}/images/random/${n}`
    : `${API}/breeds/image/random/${n}`;
}

async function pedir(url, senal) {
  const respuesta = await fetch(url, { signal: senal });
  if (!respuesta.ok) {
    throw new Error("La API respondió con código " + respuesta.status);
  }
  const datos = await respuesta.json();
  if (datos.status !== "success") {
    throw new Error("La API devolvió un error");
  }
  return datos.message;
}

// ---------- Dibujar ----------
function pintarMensaje() {
  mensaje.innerHTML = "";
  mensaje.removeAttribute("role");
  mensaje.className = "";

  if (cargando) {
    mensaje.className = "mensaje cargando";
    mensaje.setAttribute("role", "status");
    mensaje.textContent = "Cargando imágenes...";
  } else if (error) {
    mensaje.className = "mensaje error";
    mensaje.setAttribute("role", "alert");
    const texto = document.createElement("span");
    texto.textContent = error;
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Reintentar";
    boton.addEventListener("click", () => ultimaAccion && ultimaAccion());
    mensaje.append(texto, boton);
  }
}

function pintarGaleria() {
  if (listaPintada === imagenes) return; // solo redibuja si cambió la lista
  listaPintada = imagenes;
  galeria.innerHTML = "";

  imagenes.forEach((url) => {
    const nombre = nombreRaza(url);

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    const img = document.createElement("img");
    img.src = url;
    img.alt = "Perro de raza " + nombre;
    img.loading = "lazy";

    const p = document.createElement("p");
    p.textContent = nombre;

    tarjeta.append(img, p);
    galeria.appendChild(tarjeta);
  });
}

function render() {
  pintarMensaje();
  pintarGaleria();
  contador.textContent =
    `${imagenes.length} imágenes · raza: ${razaElegida ? mayuscula(razaElegida) : "Todas"}`;
  btnMas.disabled = cargando;
}

function pintarSelector() {
  razas.forEach((raza) => {
    const opcion = document.createElement("option");
    opcion.value = raza;
    opcion.textContent = mayuscula(raza);
    selector.appendChild(opcion);
  });
  selector.value = razaElegida;
}

// ---------- Acciones ----------
// Carga 50 imágenes y REEMPLAZA la galería
async function cargarImagenes() {
  ultimaAccion = cargarImagenes;
  if (controlador) controlador.abort(); // cancela la petición anterior
  controlador = new AbortController();
  const senal = controlador.signal;

  cargando = true;
  error = null;
  render();

  try {
    const lista = await pedir(urlImagenes(50), senal);
    if (senal.aborted) return;
    imagenes = lista;
  } catch (e) {
    if (e.name === "AbortError") return;
    imagenes = [];
    error = "No se pudieron cargar las imágenes. " + e.message;
  } finally {
    if (!senal.aborted) {
      cargando = false;
      render();
    }
  }
}

// Trae 5 imágenes y las AGREGA al final, sin repetir
async function traerMas() {
  ultimaAccion = traerMas;
  if (cargando) return;
  controlador = new AbortController();
  const senal = controlador.signal;

  cargando = true;
  error = null;
  render();

  try {
    const nuevas = await pedir(urlImagenes(5), senal);
    if (senal.aborted) return;
    const vistas = new Set(imagenes);
    const unicas = [];
    nuevas.forEach((url) => {
      if (!vistas.has(url)) {
        vistas.add(url);
        unicas.push(url);
      }
    });
    imagenes = imagenes.concat(unicas);
  } catch (e) {
    if (e.name === "AbortError") return;
    error = "No se pudieron traer más imágenes. " + e.message; // las fotos anteriores se conservan
  } finally {
    if (!senal.aborted) {
      cargando = false;
      render();
    }
  }
}

async function cargarRazas() {
  try {
    const objeto = await pedir(`${API}/breeds/list/all`);
    razas = Object.keys(objeto).sort();
    pintarSelector();
  } catch (e) {
    error = "No se pudo cargar la lista de razas. " + e.message;
    ultimaAccion = cargarRazas;
    render();
  }
}

// ---------- Eventos ----------
selector.addEventListener("change", () => {
  razaElegida = selector.value;
  cargarImagenes();
});

btnMas.addEventListener("click", traerMas);

// ---------- Inicio ----------
cargarRazas();
cargarImagenes();