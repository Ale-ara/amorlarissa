// =========================
// SCROLL
// =========================
function scrollParaMusica() {
  document.querySelector(".tela2").scrollIntoView({
    behavior: "smooth"
  });
}


// =========================
// PLAYER
// =========================
const musica = document.getElementById("musica");
const progresso = document.getElementById("progresso");
const iconPlay = document.getElementById("iconPlay");

let tocando = false;

function toggleMusica() {
  vibrar();

  if (tocando) {
    musica.pause();
    iconPlay.innerHTML = '<path fill="currentColor" d="M8 5v14l11-7z"/>';
  } else {
    musica.play();
    iconPlay.innerHTML = '<path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z"/>';
  }

  tocando = !tocando;
}

function reiniciarMusica() {
  vibrar();
  musica.currentTime = 0;
  musica.play();
  iconPlay.innerHTML = '<path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z"/>';
  tocando = true;
}


// autoplay suave
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !tocando) {
      musica.play().catch(() => {});
      tocando = true;
    }

    if (!entry.isIntersecting && tocando) {
      musica.pause();
      iconPlay.innerHTML = '<path fill="currentColor" d="M8 5v14l11-7z"/>';
      tocando = false;
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
// CONTADOR PADRÃO
// =========================
const dataInicio = new Date("2025-05-27T00:00:00");

function atualizarContador() {
  const agora = new Date();
  let diff = agora - dataInicio;

  document.getElementById("horasJuntos").innerText =
    Math.floor(diff / (1000 * 60 * 60)).toLocaleString();
}

setInterval(atualizarContador, 1000);
atualizarContador();


// =========================
// 🔥 ANIMAÇÃO DA CONEXÃO
// =========================
function animarNumero(elemento, valorFinal) {
  let atual = 0;
  let incremento = Math.ceil(valorFinal / 60);

  const intervalo = setInterval(() => {
    atual += incremento;

    if (atual >= valorFinal) {
      atual = valorFinal;
      clearInterval(intervalo);
    }

    elemento.innerText = atual;
  }, 20);
}

function iniciarAnimacaoConexao() {
  const inicio = new Date("2025-05-27T00:00:00");
  const agora = new Date();

  const dias = Math.floor((agora - inicio) / (1000 * 60 * 60 * 24));

  const el = document.getElementById("diasTotal");

  if (el && !el.classList.contains("animado")) {
    el.classList.add("animado");
    animarNumero(el, dias);
  }
}

// ativa quando entra na tela 3
const observerConexao = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      iniciarAnimacaoConexao();
    }
  });
}, { threshold: 0.5 });

observerConexao.observe(document.querySelector(".tela3"));


// =========================
// MENSAGEM
// =========================
function toggleMensagem() {
  vibrar();
  document.getElementById("mensagem").classList.toggle("mostrar");
}


// =========================
// STORIES
// =========================
let storyIndex = 0;
const stories = document.querySelectorAll(".story");
const barras = document.querySelectorAll(".barra");

let tempoStory = 4000;
let intervaloStory;

function mostrarStory(index) {
  stories.forEach((story, i) => {
    story.classList.remove("active");

    const span = barras[i].querySelector("span");
    span.style.transition = "none";
    span.style.width = "0%";

    if (i === index) {
      story.classList.add("active");

      setTimeout(() => {
        span.style.transition = "width 4s linear";
        span.style.width = "100%";
      }, 50);
    }
  });
}

function proximoStory() {
  storyIndex = (storyIndex + 1) % stories.length;
  mostrarStory(storyIndex);
}

function iniciarStories() {
  intervaloStory = setInterval(proximoStory, tempoStory);
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
  clearInterval(intervaloStory);
  iniciarStories();
});

mostrarStory(0);
iniciarStories();


// =========================
// ANIMAÇÃO SUAVE
// =========================
const elementos = document.querySelectorAll(".card-inicio, .player-spotify, .card-conexao, .card-msg, .final");

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

elementos.forEach(el => animObserver.observe(el));


// =========================
// VIBRAÇÃO
// =========================
function vibrar() {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}
