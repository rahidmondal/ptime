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
};

const toggleButton = document.getElementById("toggle");

export function startTimer(updateTimer) {
  if (timerState.intervalId !== null) return; 

  const totalInitialMs =
    (editState.hours * 3600 + editState.minutes * 60 + editState.seconds) * 1000;
  
  const currentTimerDisplayedMs =
    (timerState.hours * 3600 + timerState.minutes * 60 + timerState.seconds) * 1000;

  let elapsedMsSoFar;

  if ((timerState.hours === editState.hours &&
      timerState.minutes === editState.minutes &&
      timerState.seconds === editState.seconds) ||
      (currentTimerDisplayedMs === 0 && totalInitialMs > 0)
     ) {
    elapsedMsSoFar = 0;
  } else {
    elapsedMsSoFar = totalInitialMs - currentTimerDisplayedMs;
  }

  if (elapsedMsSoFar < 0) {
    elapsedMsSoFar = 0;
  }

  timerState.startTimestamp = Date.now() - elapsedMsSoFar;
  timerState.pausedElapsed = 0; 

  timerState.intervalId = setInterval(() => {
    const now = Date.now();
    const elapsedSinceThisStart = now - timerState.startTimestamp; 
    const remainingMs = totalInitialMs - elapsedSinceThisStart;

    if (remainingMs <= 0) {
      timerState.hours = 0;
      timerState.minutes = 0;
      timerState.seconds = 0;
      pauseTimer(updateTimer); 
      if(toggleButton) toggleButton.textContent = "Start";
      localStorage.setItem("timerState", JSON.stringify({
        ...timerState, 
        intervalId: null 
      }));
    } else {
      const remainingSec = Math.floor(remainingMs / 1000);
      timerState.hours = Math.floor(remainingSec / 3600);
      timerState.minutes = Math.floor((remainingSec % 3600) / 60);
      timerState.seconds = remainingSec % 60;
      
      localStorage.setItem("timerState", JSON.stringify({
        ...timerState,
        intervalId: null 
      }));
      updateTimer();
    }
  }, 1000);
  updateTimer(); 
}

export function pauseTimer(updateTimer) {
  if (timerState.intervalId !== null) {

    timerState.pausedElapsed = Date.now() - timerState.startTimestamp;
    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
    

    localStorage.setItem("timerState", JSON.stringify({
      ...timerState,
      intervalId: null
    }));
    updateTimer();
  }
}

export function resetTimer(updateTimer) {
  if (timerState.intervalId !== null) {
    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
  }
  
  timerState.hours = editState.hours;
  timerState.minutes = editState.minutes;
  timerState.seconds = editState.seconds;
  timerState.pausedElapsed = 0; 
  timerState.startTimestamp = null; 
  
  localStorage.setItem("timerState", JSON.stringify({ 
    ...timerState, 
    intervalId: null
  }));
  updateTimer();
  if(toggleButton) toggleButton.textContent = "Start";
}

export function updateEditValue(hours, minutes, seconds, updateTimer) {
  editState.hours = hours;
  editState.minutes = minutes;
  editState.seconds = seconds;
  localStorage.setItem("editState", JSON.stringify(editState));
  resetTimer(updateTimer); 
}

export function getCurrentState() {
  return timerState;
}

export function isTimerRunning() {
  return timerState.intervalId !== null;
}

export function loadState() {
  const savedEditJSON = localStorage.getItem("editState");
  if (savedEditJSON) {
    const parsedEdit = JSON.parse(savedEditJSON);
    editState.hours = parsedEdit.hours;
    editState.minutes = parsedEdit.minutes;
    editState.seconds = parsedEdit.seconds;
  }

  const savedTimerJSON = localStorage.getItem("timerState");
  if (savedTimerJSON) {
    const parsedTimer = JSON.parse(savedTimerJSON);
    timerState.hours = parsedTimer.hours;
    timerState.minutes = parsedTimer.minutes;
    timerState.seconds = parsedTimer.seconds;
    timerState.startTimestamp = parsedTimer.startTimestamp || null;
    timerState.pausedElapsed = parsedTimer.pausedElapsed || 0;
    timerState.intervalId = null; 

    if (timerState.hours === 0 && timerState.minutes === 0 && timerState.seconds === 0) {
      if (!(editState.hours === 0 && editState.minutes === 0 && editState.seconds === 0)) {
        timerState.hours = editState.hours;
        timerState.minutes = editState.minutes;
        timerState.seconds = editState.seconds;
        timerState.startTimestamp = null; 
        timerState.pausedElapsed = 0;
      }
    }
  } else {
    timerState.hours = editState.hours;
    timerState.minutes = editState.minutes;
    timerState.seconds = editState.seconds;
    timerState.startTimestamp = null;
    timerState.pausedElapsed = 0;
  }
}

export function getEditState() {
  return { ...editState };
}