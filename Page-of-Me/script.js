/* ============ EDITA AQUÍ TUS DATOS ============ */
const USUARIO = "@JuanDa_KO";

const MENU = [
  { label: "Inicio" },
  { label: "¿Quién soy?" },
  { label: "Podcast", externo: true },
  { label: "Blog", externo: true },
  { label: "Arquitectura" },
  { label: "Eventos" },
  { label: "Videos" },
  { label: "Habilidades" },
  { label: "Recursos" },
  { label: "Contacto" },
];

const BANDERAS = ["🇨🇴", "🇺🇸", "🇧🇷"];

const BADGE = "HABLEMOS - MÁS ALLÁ DEL CÓDIGO";
const INTRO =
  "No todo en mi vida son líneas de código, arquitecturas y diagramas. Fuera de la pantalla cultivo pasiones que me mantienen creativo, equilibrado y conectado con lo que realmente importa.";

const GUSTOS = [
  { foto: "assets/images/comida.jpeg", icono: "🍽️", titulo: "Pasión por la comida", texto: "Me gusta mucho comer, disfruto cada mordisco que le doy a un delicioso plato, y si es con compañía mejor." },
  { foto: "assets/images/bicicleta.jpg", icono: "🚴", titulo: "Rutas en bicicleta", texto: "Me gusta mucho salir a montar cicla, disfrutar de la ciclovia con mis amigos y probar cuanta resistencia tengo." },
  { foto: "assets/images/videojuegos.jpeg", icono: "🎮", titulo: "VideoJuegos", texto: "Apasionado a jugar y platinar todo tipo de juegos, pueden pasar muchas horas y no me dare de cuenta." },
  { foto: "assets/images/gatos.jpeg", icono: "🐈‍⬛", titulo: "Amor por los gatos", texto: "Me gustan mucho las mascotas sobretodo los gatos, por eso adoto tener a mis dos gatas dulce y candy." },
  { foto: "assets/images/familia.jpeg", icono: "⏳", titulo: "Tiempo de calidad", texto: "Me gusta pasar tiempo con mi familia, novia y amigos, disfrutar con ellos me alegra la vida y me alentan a seguir adelante." },
  { foto: "assets/images/gym.jpeg", icono: "💪", titulo: "Gym", texto: "Mucha moral con el gimnasio, mantener una disciplina y perseverancia constante me hacen sentir muy bien consigo mismo." },
];

const FRASE =
  "Un buen desarrollador sabe cuándo desconectar. Un gran desarrollador tiene un compañero peludo que se lo recuerda todos los días.";

const IMAGEN = "assets/images/gatos.png";
const IMAGEN_CIRCULO = "assets/images/gatos.png"; // imagen que aparece dentro del círculo del mouse (puede ser otra)
const ETIQUETA_FLOTANTE = "Best Friend";
/* =============================================== */

// Usuario, badge, intro, frase, etiqueta
document.getElementById("usuario").textContent = USUARIO;
document.getElementById("badge").textContent = BADGE;
document.getElementById("intro").textContent = INTRO;
document.getElementById("frase").textContent = "“" + FRASE + "”";
document.getElementById("etiqueta").textContent = ETIQUETA_FLOTANTE;

// Menú (decorativo)
const menu = document.getElementById("menu");
MENU.forEach((m) => {
  const el = document.createElement("span");
  el.className = "item";
  el.textContent = m.label;
  if (m.externo) {
    const ext = document.createElement("span");
    ext.className = "ext";
    ext.textContent = "↗";
    el.appendChild(ext);
  }
  menu.appendChild(el);
});
const banderas = document.createElement("div");
banderas.className = "banderas";
BANDERAS.forEach((b) => {
  const s = document.createElement("span");
  s.textContent = b;
  banderas.appendChild(s);
});
menu.appendChild(banderas);

// Tarjetas
const contenedor = document.getElementById("gustos");
GUSTOS.forEach((g) => {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.foto = g.foto || "";
  card.dataset.icono = g.icono;
  card.innerHTML = `
    <div class="card-h">
      <div class="ico">${g.icono}</div>
      <h3>${g.titulo}</h3>
    </div>
    <p>${g.texto}</p>
  `;
  contenedor.appendChild(card);
});

// Imagen
const imagen = document.getElementById("imagen");
if (IMAGEN) {
  const wrap = document.createElement("div");
  wrap.className = "imagen-wrap";

  const img = document.createElement("img");
  img.src = IMAGEN;
  img.alt = "";
  wrap.appendChild(img);

  // Círculo que sigue al mouse
  const circulo = document.createElement("div");
  circulo.className = "circulo";
  circulo.style.backgroundImage = `url("${IMAGEN_CIRCULO}")`;
  wrap.appendChild(circulo);

  wrap.addEventListener("mouseenter", () => circulo.classList.add("visible"));
  wrap.addEventListener("mouseleave", () => {
    circulo.classList.remove("visible");
    img.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)"; // vuelve a su posición
  });
  wrap.addEventListener("mousemove", (e) => {
    const r = wrap.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    circulo.style.left = x + "px";
    circulo.style.top = y + "px";

    // Efecto 3D: la imagen se inclina hacia el mouse
    const MAX = 14; // grados máximos de inclinación
    const rotY = ((x / r.width) - 0.5) * 2 * MAX;
    const rotX = -((y / r.height) - 0.5) * 2 * MAX;
    img.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
  });

  imagen.appendChild(wrap);
} else {
  imagen.innerHTML = '<div class="placeholder">Pon aquí tu imagen<br>(variable IMAGEN)</div>';
}


// Círculo con foto que sigue al mouse sobre cada tarjeta
const circuloCard = document.createElement("div");
circuloCard.className = "circulo-card";
document.body.appendChild(circuloCard);

function mostrarFoto(card) {
  const foto = card.dataset.foto;
  circuloCard.style.backgroundImage = "none";
  circuloCard.textContent = card.dataset.icono; // emoji por defecto
  if (foto) {
    const test = new Image();
    test.onload = () => {
      circuloCard.textContent = "";
      circuloCard.style.backgroundImage = `url("${foto}")`;
    };
    test.src = foto;
  }
}

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    mostrarFoto(card);
    circuloCard.classList.add("visible");
  });
  card.addEventListener("mouseleave", () => circuloCard.classList.remove("visible"));
  card.addEventListener("mousemove", (e) => {
    circuloCard.style.left = e.clientX + "px";
    circuloCard.style.top = e.clientY + "px";
  });
});
