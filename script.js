// ============================================
//  EDGE POMODORO 2.0 – brutalist, minimal, sharp
// ============================================

// ----- DOM -----
const canvas = document.getElementById('progressCanvas');
const ctx = canvas.getContext('2d');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const modeEl = document.querySelector('.mode');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

// ----- timer settings -----
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

// ----- state -----
let isWorkMode = true;
let isRunning = false;
let timeLeft = WORK_TIME;
let totalTime = WORK_TIME;
let interval = null;

// ----- canvas dimensions -----
const w = canvas.width;
const h = canvas.height;
const centerX = w / 2;
const centerY = h / 2;
const radius = 98;
const lineWidth = 4;       // thinner = more precise

// ===== utilities =====
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return {
    mins: mins.toString().padStart(2, '0'),
    secs: secs.toString().padStart(2, '0')
  };
}

// optional beep – clean, short
function beep() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 880;
  gain.gain.value = 0.15;
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

// ===== canvas ring – no glow, solid & sharp =====
function drawRing(progress) {
  ctx.clearRect(0, 0, w, h);

  // background ring (inactive)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // active ring – toxic cyan, no shadow, crisp edges
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * progress);

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.strokeStyle = '#00ffc3';
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';    // slightly softer ends, still precise
  ctx.stroke();
}

// ===== UI update =====
function updateUI() {
  const { mins, secs } = formatTime(timeLeft);
  minutesEl.textContent = mins;
  secondsEl.textContent = secs;
  modeEl.textContent = isWorkMode ? 'work' : 'break';
  modeEl.style.color = isWorkMode ? '#aaa' : '#00ffc3'; // subtle mode hint
  drawRing(timeLeft / totalTime);
}

// ===== timer logic =====
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  interval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateUI();
    } else {
      clearInterval(interval);
      isRunning = false;
      beep();

      isWorkMode = !isWorkMode;
      timeLeft = isWorkMode ? WORK_TIME : BREAK_TIME;
      totalTime = isWorkMode ? WORK_TIME : BREAK_TIME;
      updateUI();
      // uncomment next line for auto‑start:
      // startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
  updateUI();
}

function resetTimer() {
  pauseTimer();
  isWorkMode = true;
  timeLeft = WORK_TIME;
  totalTime = WORK_TIME;
  updateUI();
}

// ===== event listeners =====
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// ===== init =====
updateUI();