// DOM Elements
const menu = document.getElementById('menu');
const settings = document.getElementById('settings');
const info = document.getElementById('info');
const gameCanvas = document.getElementById('gameCanvas');

const startButton = document.getElementById('startButton');
const settingsButton = document.getElementById('settingsButton');
const infoButton = document.getElementById('infoButton');
const backToMenu = document.getElementById('backToMenu');
const backToMenuInfo = document.getElementById('backToMenuInfo');
const usernameInput = document.getElementById('username');
const toggleSound = document.getElementById('toggleSound');
const toggleVibration = document.getElementById('toggleVibration');
const graphicsQuality = document.getElementById('graphicsQuality');

// Game Settings
let soundOn = true;
let vibrationOn = false;
let graphics = 'High';

// Load Username
usernameInput.value = localStorage.getItem('username') || '';

// Menu Navigation
startButton.addEventListener('click', () => {
  if (usernameInput.value.trim() === '') {
    alert('Please enter a username.');
    return;
  }
  localStorage.setItem('username', usernameInput.value);
  menu.classList.remove('active');
  gameCanvas.classList.add('active');
  startGame();
});

settingsButton.addEventListener('click', () => {
  menu.classList.remove('active');
  settings.classList.add('active');
});

infoButton.addEventListener('click', () => {
  menu.classList.remove('active');
  info.classList.add('active');
});

backToMenu.addEventListener('click', () => {
  settings.classList.remove('active');
  menu.classList.add('active');
});

backToMenuInfo.addEventListener('click', () => {
  info.classList.remove('active');
  menu.classList.add('active');
});

// Settings Toggles
toggleSound.addEventListener('click', () => {
  soundOn = !soundOn;
  toggleSound.textContent = `Sound: ${soundOn ? 'On' : 'Off'}`;
});

toggleVibration.addEventListener('click', () => {
  vibrationOn = !vibrationOn;
  toggleVibration.textContent = `Vibration: ${vibrationOn ? 'On' : 'Off'}`;
});

graphicsQuality.addEventListener('click', () => {
  graphics = graphics === 'High' ? 'Medium' : graphics === 'Medium' ? 'Low' : 'High';
  graphicsQuality.textContent = `Graphics: ${graphics}`;
});

// Start Game Logic
function startGame() {
  const ctx = gameCanvas.getContext('2d');
  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight;

  let particles = [];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.size *= 0.95; // Shrink over time
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.size, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Event for mouse or touch interactions
  gameCanvas.addEventListener('mousemove', (event) => {
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(event.x, event.y));
    }
  });

  gameCanvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(touch.clientX, touch.clientY));
    }
  });

  function handleParticles() {
    particles.forEach((particle, index) => {
      particle.update();
      particle.draw();
      if (particle.size < 0.5) {
        particles.splice(index, 1);
      }
    });
  }

  function animate() {
    ctx.fillStyle = 'black'; // Set background color
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height); // Clear and fill background
    handleParticles();
    requestAnimationFrame(animate);
  }

  animate();
}
