let timerDisplay = document.getElementById("timer");
let startPauseBtn = document.getElementById("startPauseBtn");
let interval;
let totalSeconds = 0;
let isRunning = false;

function updateDisplay() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(interval);
    startPauseBtn.textContent = "Start";
  } else {
    if (totalSeconds === 0) {
      const hrs = parseInt(document.getElementById("hours").value) || 0;
      const mins = parseInt(document.getElementById("minutes").value) || 0;
      const secs = parseInt(document.getElementById("seconds").value) || 0;
      totalSeconds = hrs * 3600 + mins * 60 + secs;
    }
    if (totalSeconds > 0) {
      interval = setInterval(countdown, 1000);
      startPauseBtn.textContent = "Pause";
    }
  }
  isRunning = !isRunning;
}

function countdown() {
  if (totalSeconds <= 0) {
    clearInterval(interval);
    isRunning = false;
    startPauseBtn.textContent = "Start";
    triggerAlarm();
    return;
  }
  totalSeconds--;
  updateDisplay();
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  totalSeconds = 0;
  updateDisplay();
  startPauseBtn.textContent = "Start";
  document.body.classList.remove("alarm");
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}


updateDisplay();

// Load saved timer from edit.html
window.addEventListener('load', () => {
  const saved = localStorage.getItem('timerSet');
  if (saved) {
    const { h, m, s } = JSON.parse(saved);
    totalSeconds = parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
    updateDisplay();
    localStorage.removeItem('timerSet');
  }
});

function saveTime() {
  const h = document.getElementById('editHours').value || 0;
  const m = document.getElementById('editMinutes').value || 0;
  const s = document.getElementById('editSeconds').value || 0;
  localStorage.setItem('timerSet', JSON.stringify({ h, m, s }));
  window.location.href = 'index.html';
}