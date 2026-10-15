const FRENCH_NUMBERS = [
  "", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
  "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt",
  "vingt et un", "vingt-deux", "vingt-trois", "vingt-quatre", "vingt-cinq", "vingt-six", "vingt-sept", "vingt-huit", "vingt-neuf", "trente",
  "trente et un", "trente-deux", "trente-trois", "trente-quatre", "trente-cinq", "trente-six", "trente-sept", "trente-huit", "trente-neuf", "quarante",
  "quarante et un", "quarante-deux", "quarante-trois", "quarante-quatre", "quarante-cinq", "quarante-six", "quarante-sept", "quarante-huit", "quarante-neuf", "cinquante"
];

const grid = document.getElementById("soundboardGrid");
const nowPlaying = document.getElementById("nowPlaying");
const nowPlayingText = document.getElementById("nowPlayingText");
const volumeSlider = document.getElementById("volumeSlider");
const volumeIcon = document.getElementById("volumeIcon");
const randomBtn = document.getElementById("randomBtn");
const stopBtn = document.getElementById("stopBtn");

let currentVolume = 1;
const activeAudios = new Set();
const padElements = new Map();

function updateNowPlaying(num) {
  if (num === null) {
    nowPlaying.classList.remove("active");
    nowPlayingText.textContent = "Prêt";
  } else {
    nowPlaying.classList.add("active");
    nowPlayingText.textContent = `Lecture : ${num} (${FRENCH_NUMBERS[num]})`;
  }
}

function stopAllSounds() {
  activeAudios.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  activeAudios.clear();
  padElements.forEach((btn) => btn.classList.remove("playing"));
  updateNowPlaying(null);
}

function playNumber(num) {
  const btn = padElements.get(num);
  const audio = new Audio(`sounds/${num}.wav`);
  audio.volume = currentVolume;

  if (btn) {
    btn.classList.add("playing");
  }
  activeAudios.add(audio);
  updateNowPlaying(num);

  const cleanup = () => {
    activeAudios.delete(audio);
    if (btn) {
      btn.classList.remove("playing");
    }
    if (activeAudios.size === 0) {
      updateNowPlaying(null);
    }
  };

  audio.addEventListener("ended", cleanup);
  audio.addEventListener("error", cleanup);

  audio.play().catch((err) => {
    console.error(`Erreur lecture sounds/${num}.wav :`, err);
    cleanup();
  });
}

// Génération des 50 boutons
for (let i = 1; i <= 50; i++) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sound-pad";
  btn.dataset.number = i;
  btn.setAttribute("aria-label", `Jouer le nombre ${i} (${FRENCH_NUMBERS[i]})`);

  btn.innerHTML = `
    <span class="pad-number">${i}</span>
    <span class="pad-word">${FRENCH_NUMBERS[i]}</span>
  `;

  btn.addEventListener("click", () => playNumber(i));
  padElements.set(i, btn);
  grid.appendChild(btn);
}

// Gestion du volume
volumeSlider.addEventListener("input", (e) => {
  currentVolume = parseFloat(e.target.value);
  activeAudios.forEach((audio) => {
    audio.volume = currentVolume;
  });
  if (currentVolume === 0) {
    volumeIcon.textContent = "🔇";
  } else if (currentVolume < 0.5) {
    volumeIcon.textContent = "🔈";
  } else {
    volumeIcon.textContent = "🔉";
  }
});

// Bouton Aléatoire
randomBtn.addEventListener("click", () => {
  const randomNum = Math.floor(Math.random() * 50) + 1;
  playNumber(randomNum);
});

// Bouton Stop
stopBtn.addEventListener("click", stopAllSounds);
