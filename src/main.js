import { startTimer, pauseTimer, updateEditValue, resetTimer, getCurrentState , isTimerRunning } from "./timer.js";



// Timer Area
const timerDisplay = document.getElementById("timer");
const toggleButton = document.getElementById("toggle");
const editButton = document.getElementById("edit");
const resetButton = document.getElementById("reset");

// Edit Area
const editContainer = document.getElementById("edit-container");
const saveButton = document.getElementById("save");




// Event Handlers Timer Area
toggleButton.addEventListener("click",()=>{
    if(isTimerRunning()){
        pauseTimer(updateTimerDisplay);
        toggleButton.textContent = "Start";
    }else{
        startTimer(updateTimerDisplay);
        toggleButton.textContent = "Pause";
    }

})


resetButton.addEventListener("click",()=>{
    console.log(resetButton);
    resetTimer(updateTimerDisplay);
    toggleButton.textContent = "Start";

})

editButton.addEventListener("click",()=>{
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
saveButton.addEventListener("click",()=>{
    editContainer.classList.toggle("hidden");
    const hours = parseInt( document.getElementById("editHours").value) || 0;
    const minutes = parseInt(document.getElementById("editMinutes").value) || 0;
    const seconds = parseInt(document.getElementById("editSeconds").value) || 0;
    updateEditValue(hours,minutes,seconds,updateTimerDisplay);
    updateTimerDisplay();
    toggleButton.textContent = "Start";
})




