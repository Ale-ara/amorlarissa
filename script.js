// =========================
// SCROLL INICIAL
// =========================
function scrollParaMusica() {
  document.querySelector(".tela2").scrollIntoView({
    behavior: "smooth"
  });
}


// =========================
// PLAYER DE MÚSICA
// =========================
const musica = document.getElementById("musica");
const progresso = document.getElementById("progresso");
const btnPlay = document.querySelector(".play");

let tocando = false;

function toggleMusica() {
  vibrar();

  if (tocando) {
    musica.pause();
    btnPlay.innerText = "▶";
  } else {
    musica.play();
    btnPlay.innerText = "⏸";
  }
  tocando = !tocando;
}

function reiniciarMusica() {
  vibrar();
  musica.currentTime = 0;
  musica.play();
  btnPlay.innerText = "⏸";
  tocando = true;
}

// autoplay quando entrar na tela
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      musica.play();
      btnPlay.innerText = "⏸";
      tocando = true;
    }
  });
}, { threshold: 0.6 });

observer.observe(document.querySelector(".tela2"));


// progresso
musica.addEventListener("timeupdate", () => {
  if (musica.duration) {
    progresso.value = (musica.currentTime / musica.duration) * 100;

    document.getElementById("inicio").innerText = formatarTempo(musica.currentTime);
    document.getElementById("fim").innerText = formatarTempo(musica.duration);
  }
});

progresso.addEventListener("input", () => {
  musica.currentTime = (progresso.value / 100) * musica.duration;
});

function formatarTempo(segundos) {
  let min = Math.floor(segundos / 60);
  let sec = Math.floor(segundos % 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}


// =========================
// CONTADOR
// =========================
const dataInicio = new Date("2025-05-27T00:00:00");

function atualizarContador() {
  const agora = new Date();
  let diff = agora - dataInicio;

  let segundos = Math.floor(diff / 1000) % 60;
  let minutos = Math.floor(diff / (1000 * 60)) % 60;
  let horas = Math.floor(diff / (1000 * 60 * 60)) % 24;
  let diasTotal = Math.floor(diff / (1000 * 60 * 60 * 24));

  let anos = Math.floor(diasTotal / 365);
  let meses = Math.floor((diasTotal % 365) / 30);
  let dias = (diasTotal % 365) % 30;

  document.getElementById("anos").innerText = anos;
  document.getElementById("meses").innerText = meses;
  document.getElementById("dias").innerText = dias;
  document.getElementById("horas").innerText = horas;
  document.getElementById("minutos").innerText = minutos;
  document.getElementById("segundos").innerText = segundos;

  document.getElementById("horasJuntos").innerText =
    Math.floor(diff / (1000 * 60 * 60)).toLocaleString();
}

setInterval(atualizarContador, 1000);
atualizarContador();


// =========================
// MENSAGEM
// =========================
function toggleMensagem() {
  vibrar();
  const msg = document.getElementById("mensagem");

  msg.classList.toggle("mostrar");
}


// =========================
// STORIES SUAVE + AUTO
// =========================
let storyIndex = 0;
const stories = document.querySelectorAll(".story");
const barras = document.querySelectorAll(".barra");

let tempoStory = 4000; // 4s
let intervaloStory;

function mostrarStory(index) {
  stories.forEach((story, i) => {
    story.classList.remove("active");

    if (i === index) {
      story.classList.add("active");
      animarBarra(i);
    }
  });
}

function proximoStory() {
  storyIndex++;
  if (storyIndex >= stories.length) storyIndex = 0;
  mostrarStory(storyIndex);
}

function iniciarStories() {
  intervaloStory = setInterval(proximoStory, tempoStory);
}

function resetarStories() {
  clearInterval(intervaloStory);
  iniciarStories();
}

document.querySelector(".tela5").addEventListener("click", (e) => {
  vibrar();

  const largura = window.innerWidth;

  if (e.clientX > largura / 2) {
    storyIndex++;
  } else {
    storyIndex--;
  }

  if (storyIndex >= stories.length) storyIndex = 0;
  if (storyIndex < 0) storyIndex = stories.length - 1;

  mostrarStory(storyIndex);
  resetarStories();
});

mostrarStory(0);
iniciarStories();


// =========================
// ANIMAÇÃO SUAVE AO ENTRAR
// =========================
const elementos = document.querySelectorAll(".tela div");

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

elementos.forEach(el => animObserver.observe(el));


// =========================
// VIBRAÇÃO (IPHONE)
// =========================
function vibrar() {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}

// animação da barra tipo instagram
function animarBarra(index) {
  const barra = barras[index].querySelector("span");

  barra.style.width = "0%";

  setTimeout(() => {
    barra.style.transition = "width 4s linear";
    barra.style.width = "100%";
  }, 50);
}