// =========================
// SCROLL COM TRANSIÇÃO
// =========================
function scrollParaMusica() {
  const tela = document.querySelector(".tela1");

  tela.style.transition = "0.6s";
  tela.style.opacity = "0";
  tela.style.transform = "scale(1.05)";

  setTimeout(() => {
    document.querySelector(".tela2").scrollIntoView({
      behavior: "smooth"
    });
  }, 400);
}


// =========================
// PLAYER
// =========================
const musica = document.getElementById("musica");
const progresso = document.getElementById("progresso");
const iconPlay = document.getElementById("iconPlay");

let tocando = false;

function fadeInMusica() {
  musica.volume = 0;
  let vol = 0;

  const intervalo = setInterval(() => {
    vol += 0.05;
    if (vol >= 1) {
      vol = 1;
      clearInterval(intervalo);
    }
    musica.volume = vol;
  }, 100);
}

function toggleMusica() {
  vibrar();

  if (tocando) {
    musica.pause();
    iconPlay.innerHTML = '<path fill="currentColor" d="M8 5v14l11-7z"/>';
  } else {
    musica.play();
    fadeInMusica();
    iconPlay.innerHTML = '<path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z"/>';
  }

  tocando = !tocando;
}

function reiniciarMusica() {
  vibrar();
  musica.currentTime = 0;
  musica.play();
  fadeInMusica();
  tocando = true;
}


// autoplay controlado
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !tocando) {
      musica.play().catch(() => {});
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
// CONEXÃO (ANIMAÇÃO)
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
  const inicio = new Date("2025-05-27");
  const agora = new Date();

  const dias = Math.floor((agora - inicio) / (1000 * 60 * 60 * 24));

  const el = document.getElementById("diasTotal");

  if (el && !el.classList.contains("animado")) {
    el.classList.add("animado");
    animarNumero(el, dias);
  }
}

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) iniciarAnimacaoConexao();
  });
}).observe(document.querySelector(".tela3"));


// =========================
// MENSAGEM
// =========================
function toggleMensagem() {
  vibrar();
  document.getElementById("mensagem").classList.toggle("mostrar");
}


// =========================
// STORIES COMPLETO
// =========================
// =========================
// STORIES NÍVEL INSTAGRAM
// =========================
let storyIndex = 0;
const stories = document.querySelectorAll(".story");
const barras = document.querySelectorAll(".barra");

let intervalo;
let tempoPadrao = 4000;
let pausado = false;

let startX = 0;
let endX = 0;


// MOSTRAR STORY
function mostrarStory(index) {
  stories.forEach((story, i) => {
    story.classList.remove("active");

    const span = barras[i].querySelector("span");
    span.style.transition = "none";
    span.style.width = "0%";

    const video = story.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    if (i === index) {
      story.classList.add("active");

      const videoAtual = story.querySelector("video");

      if (videoAtual) {
        videoAtual.muted = true;
        videoAtual.playsInline = true;

        videoAtual.play();

        videoAtual.onloadedmetadata = () => {
          iniciarTempo(videoAtual.duration * 1000, i);
        };

      } else {
        iniciarTempo(tempoPadrao, i);
      }
    }
  });
}


// TEMPO + BARRA
function iniciarTempo(tempo, index) {
  clearTimeout(intervalo);

  const span = barras[index].querySelector("span");

  setTimeout(() => {
    span.style.transition = `width ${tempo}ms linear`;
    span.style.width = "100%";
  }, 50);

  intervalo = setTimeout(() => {
    if (!pausado) proximoStory();
  }, tempo);
}


// AVANÇAR
function proximoStory() {
  storyIndex = (storyIndex + 1) % stories.length;
  mostrarStory(storyIndex);
}

// VOLTAR
function voltarStory() {
  storyIndex = (storyIndex - 1 + stories.length) % stories.length;
  mostrarStory(storyIndex);
}


// CLIQUE (lado da tela)
document.querySelector(".tela5").addEventListener("click", (e) => {
  if (pausado) return;

  vibrar();

  if (e.clientX > window.innerWidth / 2) {
    proximoStory();
  } else {
    voltarStory();
  }
});


// SEGURAR = PAUSAR
document.querySelector(".tela5").addEventListener("touchstart", (e) => {
  pausado = true;

  clearTimeout(intervalo);

  const video = stories[storyIndex].querySelector("video");
  if (video) video.pause();
});


// SOLTAR = CONTINUAR
document.querySelector(".tela5").addEventListener("touchend", (e) => {
  pausado = false;

  const video = stories[storyIndex].querySelector("video");
  if (video) video.play();

  iniciarTempo(tempoPadrao, storyIndex);
});


// SWIPE (ARRASTAR)
document.querySelector(".tela5").addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

document.querySelector(".tela5").addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;

  let diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      proximoStory();
    } else {
      voltarStory();
    }
  }
});


// INICIAR
mostrarStory(0);


// =========================
// ANIMAÇÃO SUAVE
// =========================
document.querySelectorAll(".card-inicio, .player-spotify, .card-conexao, .card-msg, .final")
  .forEach(el => {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.classList.add("show");
    }).observe(el);
  });


// =========================
// VIBRAÇÃO
// =========================
function vibrar() {
  if (navigator.vibrate) navigator.vibrate(10);
}


// =========================
// PARTÍCULAS
// =========================
function criarParticulas() {
  const tela = document.querySelector(".tela1");

  for (let i = 0; i < 20; i++) {
    let p = document.createElement("div");
    p.className = "particula";

    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";

    tela.appendChild(p);
  }
}

criarParticulas();
