let timerState = {
  hours: 0,
  minutes: 59,
  seconds: 59,
  intervalId: null,
};

let editState = {
  hours: 0,
  minutes: 59,
  seconds: 59,
  intervalId: null,
};


export function startTimer(updateTimer) {
  if (timerState.intervalId !== null) return;
  console.log("Timer Started");
  timerState.intervalId = setInterval(() => {
    if (timerState.hours === 0 && timerState.minutes === 0 && timerState.seconds === 0) {
      pauseTimer(updateTimer);
    } else {
      if (timerState.seconds === 0) {
        timerState.seconds = 59;
        if (timerState.minutes === 0) {
          timerState.minutes = 59;
          timerState.hours--;
        } else {
          timerState.minutes--;
        }
      }
      else {
        timerState.seconds--;
      }
      updateTimer();
    }
  }, 1000)
}

export function pauseTimer(updateTimer) {
  console.log("Timer Paused");
  clearInterval(timerState.intervalId);
  timerState.intervalId = null;
  updateTimer();

}


export function resetTimer(updateTimer) {
  console.log("Reset Timer Called");
  pauseTimer(updateTimer);
  timerState.hours = editState.hours;
  timerState.minutes = editState.minutes;
  timerState.seconds = editState.seconds;
  updateTimer();

}

export function updateEditValue(hours, minutes, seconds, updateTimer) {
  console.log("Update Edit Value Called");
  editState.hours = hours;
  editState.minutes = minutes;
  editState.seconds = seconds;
  editState.intervalId = null;
  resetTimer(updateTimer);
}

export function getCurrentState() {
  return timerState;
}

export function isTimerRunning() {
  return timerState.intervalId !== null;
}
