import { startTimer, pauseTimer, updateEditValue, resetTimer, getCurrentState, isTimerRunning,loadState } from "./timer.js";



// Timer Area
const timerDisplay = document.getElementById("timer");
const toggleButton = document.getElementById("toggle");
const editButton = document.getElementById("edit");
const resetButton = document.getElementById("reset");

// Edit Area
const editContainer = document.getElementById("edit-container");
const saveButton = document.getElementById("save");




// Event Handlers Timer Area
toggleButton.addEventListener("click", () => {
    if (isTimerRunning()) {
        pauseTimer(updateTimerDisplay);
        toggleButton.textContent = "Start";
    } else {
        startTimer(updateTimerDisplay);
        toggleButton.textContent = "Pause";
    }

})


resetButton.addEventListener("click", () => {
    console.log(resetButton);
    resetTimer(updateTimerDisplay);
    toggleButton.textContent = "Start";

})

editButton.addEventListener("click", () => {
    editContainer.classList.toggle("hidden");

})

function formatTime(unit) {
    return String(unit).padStart(2, "0");
}


function updateTimerDisplay() {
    const timerState = getCurrentState();

    const formattedHours = formatTime(timerState.hours);
    const formattedMinutes = formatTime(timerState.minutes);
    const formattedSeconds = formatTime(timerState.seconds);

    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    timerDisplay.textContent = formattedTime;

}


// Event Handlers Edit Area
saveButton.addEventListener('click', () => {
    const hours = parseInt(editHours.value);
    const minutes = parseInt(editMinutes.value);
    const seconds = parseInt(editSeconds.value);

    const validHours = hours || 0; // No Limit on Hours 
    const validMinutes = Math.min(minutes, 59) || 0;
    const validSeconds = Math.min(seconds, 59) || 0;

    updateEditValue(validHours, validMinutes, validSeconds, updateTimerDisplay);
    updateTimerDisplay();
    editContainer.classList.toggle("hidden");
    toggleButton.textContent = "Start";
});




window.addEventListener("load", () => {
    loadState();
    updateTimerDisplay();
});
  
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./serviceWorker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }