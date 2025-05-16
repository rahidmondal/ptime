let timerState = {
  hours: 0,
  minutes: 59,
  seconds: 59,
  intervalId: null,
  startTimestamp: null,
  pausedElapsed: 0
};

let editState = {
  hours: 0,
  minutes: 59,
  seconds: 59,
  intervalId: null,
};

const toggleButton = document.getElementById("toggle");

export function startTimer(updateTimer) {
  if (timerState.intervalId !== null) return;
  timerState.startTimestamp = Date.now() - timerState.pausedElapsed;
  timerState.intervalId = setInterval(() => {
  const now = Date.now();
  const elapsed = now - timerState.startTimestamp;

  const totalInitialMs = 
    (editState.hours * 3600 + editState.minutes * 60 + editState.seconds) * 1000;

  const remainingMs = totalInitialMs - elapsed;

  if (remainingMs <= 0) {
    timerState.hours = 0;
    timerState.minutes = 0;
    timerState.seconds = 0;
    pauseTimer(updateTimer);
    toggleButton.textContent = "Start";
  } else {
    const remainingSec = Math.floor(remainingMs / 1000);
    timerState.hours = Math.floor(remainingSec / 3600);
    timerState.minutes = Math.floor((remainingSec % 3600) / 60);
    timerState.seconds = remainingSec % 60;
  }

  localStorage.setItem("timerState", JSON.stringify({
    ...timerState,
    intervalId: null
  }));
  updateTimer();
}, 1000);

}

export function pauseTimer(updateTimer) {
  timerState.pausedElapsed = Date.now() - timerState.startTimestamp;
  clearInterval(timerState.intervalId);
  timerState.intervalId = null;
  updateTimer();

}


export function resetTimer(updateTimer) {
  pauseTimer(updateTimer);
  timerState.pausedElapsed = 0;
  timerState.hours = editState.hours;
  timerState.minutes = editState.minutes;
  timerState.seconds = editState.seconds;
  localStorage.setItem("timerState", JSON.stringify({ ...timerState, intervalId: null }));
  updateTimer();

}

export function updateEditValue(hours, minutes, seconds, updateTimer) {
  editState.hours = hours;
  editState.minutes = minutes;
  editState.seconds = seconds;
  editState.intervalId = null;
  localStorage.setItem("editState", JSON.stringify(editState));
  resetTimer(updateTimer);
}

export function getCurrentState() {
  return timerState;
}

export function isTimerRunning() {
  return timerState.intervalId !== null;
}


// Sync and Local Storage 

export function loadState() {
  const savedTimer = localStorage.getItem("timerState");
  const savedEdit = localStorage.getItem("editState");

  if (savedTimer) {
  const parsedTimer = JSON.parse(savedTimer);
  timerState.hours = parsedTimer.hours;
  timerState.minutes = parsedTimer.minutes;
  timerState.seconds = parsedTimer.seconds;
  timerState.intervalId = null;

  if (parsedTimer.pausedElapsed) {
    timerState.pausedElapsed = parsedTimer.pausedElapsed;
  }
  if (parsedTimer.startTimestamp) {
    timerState.startTimestamp = parsedTimer.startTimestamp;
  }
}


  if (savedEdit) {
    const parsedEdit = JSON.parse(savedEdit);
    editState.hours = parsedEdit.hours;
    editState.minutes = parsedEdit.minutes;
    editState.seconds = parsedEdit.seconds;
    editState.intervalId = null;
  }
}