// Variables
let hours = 0;
let minutes = 0;
let seconds = 0;
let intervalId = null;
let hoursInput = 0;
let minutesInput = 0;
let secondsInput = 0;

// DOM Elements 
const timerText = document.getElementById('timer');
const resetButton = document.getElementById('reset');
const editButton = document.getElementById('edit');
const saveButton = document.getElementById('save');
const triggerButton = document.getElementById('trigger');

// Audio
const alarmSound = new Audio("./Resource/alarmSound1.mp3")


// Functions

function updateTimerDisplay(){
    timerText.textContent = timerText.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}



resetButton.addEventListener("click",(e)=>{
    updateTimerDisplay();
})

editButton.addEventListener("click",(e)=>{

})

saveButton.addEventListener("click",(e)=>{
    hoursInput = parseInt(document.getElementById('hours').value);
    minutesInput = parseInt(document.getElementById('minutes').value);
    secondsInput = parseInt(document.getElementById('seconds').value);
    hours = hoursInput;
    minutes = minutesInput;
    seconds = secondsInput;

    updateTimerDisplay();
})

triggerButton.addEventListener("click",(e)=>{
    if(triggerButton.textContent==="Start"){
        triggerButton.textContent = "Pause";
        intervalId = setInterval(()=>{
            if(seconds===0 && minutes === 0 && hours === 0 ){
                clearInterval(intervalId);
                triggerButton.textContent = "Start";
                alarmSound.play();
                alert("Time is up!");
            }
            else{
                if(seconds===0){
                    seconds = 59;
                    if(minutes===0){
                        minutes = 59;
                        hours--;
                    }
                    else{
                        minutes--;
                    }
                }else{
                    seconds--;
                }
                updateTimerDisplay();
            }
        },1000)
    }else{
        triggerButton.textContent = "Start";
        clearInterval(intervalId);
        alarmSound.pause();
    }

})

resetButton.addEventListener("click",(e)=>{
    hours = hoursInput;
    minutes = minutesInput;
    seconds = secondsInput; 
    clearInterval(intervalId);
    triggerButton.textContent = "Start";
    updateTimerDisplay();
})