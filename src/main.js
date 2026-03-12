import { startTimer, pauseTimer, updateEditValue, resetTimer, getEditState, getCurrentState, isTimerRunning, loadState } from "./timer.js";

// Theme & Settings Area
const themeToggleButton = document.getElementById("theme-toggle");
const themeIconMoon = document.getElementById("theme-icon-moon");
const themeIconSun = document.getElementById("theme-icon-sun");
const metaThemeColor = document.getElementById("meta-theme-color");
const installAppButton = document.getElementById("install-app");
let deferredPrompt;

// Timer Area
const toggleButton = document.getElementById("toggle");
const editButton = document.getElementById("edit");
const resetButton = document.getElementById("reset");
const timerContainer = document.getElementById("timer-container");
const toggleFullscreenButton = document.getElementById("fullscreen");

function updateFlipCard(cardId, newValue) {
    const card = document.getElementById(cardId);
    if (!card) return;
    
    const formattedValue = String(newValue).padStart(2, '0');
    const currentValue = card.dataset.value || formattedValue;
    
    // First time init
    if (!card.hasAttribute('data-value')) {
        card.dataset.value = formattedValue;
        card.querySelector('.flip-top span').textContent = formattedValue;
        card.querySelector('.flip-bottom span').textContent = formattedValue;
        return;
    }

    if (currentValue === formattedValue) return;

    card.dataset.value = formattedValue;

    const flipTopSpan = card.querySelector('.flip-top span');
    const flipBottomSpan = card.querySelector('.flip-bottom span');

    flipTopSpan.textContent = formattedValue;
    flipBottomSpan.textContent = currentValue;

    const flapTop = document.createElement('div');
    flapTop.className = 'flap-top fall';
    const flapTopSpan = document.createElement('span');
    flapTopSpan.textContent = currentValue; 
    flapTop.appendChild(flapTopSpan);

    const flapBottom = document.createElement('div');
    flapBottom.className = 'flap-bottom fall';
    const flapBottomSpan = document.createElement('span');
    flapBottomSpan.textContent = formattedValue; 
    flapBottom.appendChild(flapBottomSpan);

    card.appendChild(flapTop);
    card.appendChild(flapBottom);

    setTimeout(() => {
        if (card.contains(flapTop)) card.removeChild(flapTop);
        if (card.contains(flapBottom)) card.removeChild(flapBottom);
        flipBottomSpan.textContent = formattedValue; 
    }, 500);
}




// Edit Area
const editContainer = document.getElementById("edit-container");
const saveButton = document.getElementById("save");
const editHoursInput = document.getElementById("editHours");
const editMinutesInput = document.getElementById("editMinutes");
const editSecondsInput = document.getElementById("editSeconds");
const backFromEditButton = document.getElementById("backFromEdit");






// Theme Logic
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if(themeIconMoon) themeIconMoon.classList.add('hidden');
        if(themeIconSun) themeIconSun.classList.remove('hidden');
        if(metaThemeColor) metaThemeColor.setAttribute("content", "#101014");
    } else {
        document.body.removeAttribute('data-theme');
        if(themeIconSun) themeIconSun.classList.add('hidden');
        if(themeIconMoon) themeIconMoon.classList.remove('hidden');
        if(metaThemeColor) metaThemeColor.setAttribute("content", "#f4f7f6");
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
}

if(themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// PWA Install Logic
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if(installAppButton) installAppButton.classList.remove('hidden');
});

if(installAppButton) {
    installAppButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
            installAppButton.classList.add('hidden');
        }
    });
}

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

    updateFlipCard("flip-hours", timerState.hours);
    updateFlipCard("flip-minutes", timerState.minutes);
    updateFlipCard("flip-seconds", timerState.seconds);

    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

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
    initTheme();
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


