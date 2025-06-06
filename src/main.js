import { startTimer, pauseTimer, updateEditValue, resetTimer, getEditState, getCurrentState, isTimerRunning, loadState } from "./timer.js";



// Timer Area
const timerDisplay = document.getElementById("timer");
const toggleButton = document.getElementById("toggle");
const editButton = document.getElementById("edit");
const resetButton = document.getElementById("reset");
const timerContainer = document.getElementById("timer-container");
const toggleFullscreenButton = document.getElementById("fullscreen");




// Edit Area
const editContainer = document.getElementById("edit-container");
const saveButton = document.getElementById("save");
const editHoursInput = document.getElementById("editHours");
const editMinutesInput = document.getElementById("editMinutes");
const editSecondsInput = document.getElementById("editSeconds");
const backFromEditButton = document.getElementById("backFromEdit");






// Full Screen
toggleFullscreenButton.addEventListener("click",()=>{
    toggleFullscreen();
})

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
    resetTimer(updateTimerDisplay);
    toggleButton.textContent = "Start";

})

editButton.addEventListener("click", () => {
    updateEditInputFields();
    timerContainer.classList.toggle("hidden");
    editContainer.classList.toggle("hidden");

})

backFromEditButton.addEventListener("click", () => {
    editContainer.classList.add("hidden");
    timerContainer.classList.remove("hidden");
    updateEditInputFields(); 
});


function formatTime(unit) {
    return String(unit).padStart(2, "0");
}


function updateTimerDisplay() {
    const timerState = getCurrentState();
    const isRunning = isTimerRunning();

    const formattedHours = formatTime(timerState.hours);
    const formattedMinutes = formatTime(timerState.minutes);
    const formattedSeconds = formatTime(timerState.seconds);

    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    timerDisplay.textContent = formattedTime;

    const baseTitle = "PTime";
    let newDocumentTitle = "";

    if (isRunning) {
        newDocumentTitle = `${formattedTime} - ${baseTitle}`;
    } else {
        if (timerState.pausedElapsed > 0 && !(timerState.hours === 0 && timerState.minutes === 0 && timerState.seconds === 0)) {
            newDocumentTitle = `Paused | ${formattedTime} - ${baseTitle}`;
        } else {
            if (timerState.hours === 0 && timerState.minutes === 0 && timerState.seconds === 0) {
                newDocumentTitle = baseTitle;
            } else {
                newDocumentTitle = `${formattedTime} - ${baseTitle}`;
            }
        }
    }
    document.title = newDocumentTitle;
}

function toggleFullscreen() {
    const doc = document.documentElement;
    
    const isFullscreen = 
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement;
    
    // Toggle fullscreen
    if (!isFullscreen) {
        // Request fullscreen with browser prefixes for compatibility
        if (doc.requestFullscreen) {
            doc.requestFullscreen();
        } else if (doc.webkitRequestFullscreen) { /* Safari */
            doc.webkitRequestFullscreen();
        } else if (doc.msRequestFullscreen) { /* IE11 */
            doc.msRequestFullscreen();
        } else if (doc.mozRequestFullScreen) { /* Firefox */
            doc.mozRequestFullScreen();
        }
    } else {
        // Exit fullscreen with browser prefixes for compatibility
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        }
    }
}

// Update fullscreen change event listener to handle vendor prefixes
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

// Function to handle fullscreen change
function handleFullscreenChange() {
    const isFullscreen = 
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement;
    
    if (isFullscreen) {
        document.body.classList.add('fullscreen');
    } else {
        document.body.classList.remove('fullscreen');
    }
}

updateTimerDisplay();
// Event Handlers Edit Area
saveButton.addEventListener('click', () => {
    const hours = parseInt(editHours.value);
    const minutes = parseInt(editMinutes.value);
    const seconds = parseInt(editSeconds.value);

    const validHours = hours >= 0 ? hours : 0;
    const validMinutes = minutes >= 0 ? Math.min(minutes, 59) : 0;
    const validSeconds = seconds >= 0 ? Math.min(seconds, 59) : 0;
    


    updateEditValue(validHours, validMinutes, validSeconds, updateTimerDisplay);
    updateTimerDisplay();
    editContainer.classList.toggle("hidden");
    timerContainer.classList.toggle("hidden");
    toggleButton.textContent = "Start";
});

function updateEditInputFields() {
    const currentEditState = getEditState(); 
    editHoursInput.value = formatTime(currentEditState.hours);
    editMinutesInput.value = formatTime(currentEditState.minutes);
    editSecondsInput.value = formatTime(currentEditState.seconds);
}

const editInputs = document.querySelectorAll('#edit-container input[type="number"]');
editInputs.forEach(input => {
    input.addEventListener('focus', () => {
        setTimeout(() => {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300); // Wait for keyboard animation
    });
});

//KEYBOARD SHORTCUTS
window.addEventListener('keydown', (event) => {
    const activeElement = document.activeElement;
    const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');

    if (!editContainer.classList.contains('hidden')) {
        if (event.key === 'Enter') {
            if (isInputFocused && (activeElement === editHoursInput || activeElement === editMinutesInput || activeElement === editSecondsInput)) {
                event.preventDefault();
                saveButton.click();
            } else if (activeElement === saveButton) {
                event.preventDefault();
                saveButton.click();
            }
            return; 
        } else if (event.key === 'Escape') {
            event.preventDefault();
            backFromEditButton.click(); 
            return; 
        }

        if (isInputFocused) {
            return;
        }
    }

    switch (event.key.toLowerCase()) {
        case 'e': 
            event.preventDefault();
            if (editContainer.classList.contains('hidden')) {
                editButton.click();
            } else {
                backFromEditButton.click();
            }
            break;

        case 's':
            if (editContainer.classList.contains('hidden')) {
                event.preventDefault();
                if (!isTimerRunning()) { 
                    toggleButton.click(); 
                }
            }
            break;
        case 'p':
            if (editContainer.classList.contains('hidden')) {
                event.preventDefault();
                if (isTimerRunning()) { 
                    toggleButton.click(); 
                }
            }
            break;
        case 'r':
            if (editContainer.classList.contains('hidden')) {
                event.preventDefault();
                resetButton.click();
            }
            break;
    }
});

window.addEventListener("load", () => {
    loadState();
    updateTimerDisplay();
    updateEditInputFields();
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
};


