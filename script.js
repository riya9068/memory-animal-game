const cards = document.querySelectorAll(".card");
const resetBtn = document.getElementById("reset");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popup-text");
const timeDisplay = document.getElementById("time");

let seconds = 0;
let minutes = 0;
let timerInterval = null;
let gameStarted = false;

let matchedPairs = 0;

let firstCard = null;
let secondCard = null;
let lockBoard = false;

// Shuffle cards when page loads
function shuffleCards() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 8);
    card.style.order = randomPos;
  });
}

shuffleCards();

function flipCard() {
    if (!gameStarted) {
  startTimer();
  gameStarted = true;
}
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");
  const animal = this.dataset.animal;

  const animalEmojis = {
  monkey: "🐵",
  cat: "🐱",
  dog: "🐶",
  lion: "🦁"
};

this.innerHTML = `<span>${animalEmojis[animal]}</span>`;

//this.innerHTML = `<img src="${animalImages[animal]}" alt="${animal}">`;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkMatch();
}
// Check if cards match //
function checkMatch() {
  let isMatch = firstCard.dataset.animal === secondCard.dataset.animal;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}
// Disable cards if it's a match //
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  matchedPairs++;

  if (matchedPairs === 4) {
  stopTimer();
  showPopup("🎉 Completed in " + timeDisplay.textContent);
  launchSpiral();
}
  resetTurn();
}
// Unflip cards if not a match //

function unflipCards() {
  setTimeout(() => {
    showPopup("❌ Not a Match!");

    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    firstCard.textContent = "";
    secondCard.textContent = "";

    resetTurn();
  }, 800);
}// Popup message function //
function showPopup(message) {
  popupText.textContent = message;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 1500);
}
// Reset game state for next turn//
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

cards.forEach(card => {
  card.addEventListener("click", flipCard);
});

resetBtn.addEventListener("click", () => {
  cards.forEach(card => {
    card.classList.remove("flipped");
    card.textContent = "";
    card.addEventListener("click", flipCard);
  });
  shuffleCards();
  resetTurn();
});
//timer function //
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;

    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }

    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    timeDisplay.textContent = formattedMinutes + ":" + formattedSeconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}///confetti function//
const confettiContainer = document.getElementById("confetti-container");

function launchSpiral() {
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    const size = Math.random() * 8 + 5;
    confetti.style.width = size + "px";
    confetti.style.height = size + "px";

    confetti.style.backgroundColor =
      "hsl(" + Math.random() * 360 + ", 100%, 50%)";

    confetti.style.left = "50%";
    confetti.style.top = "50%";

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 300 + 100;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    confetti.animate(
      [
        { transform: "translate(0,0)", opacity: 1 },
        { transform: `translate(${x}px, ${y}px)`, opacity: 0 }
      ],
      {
        duration: 2000,
        easing: "ease-out"
      }
    );

    confettiContainer.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 2000);
  }
}