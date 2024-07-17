const editWrapper = document.getElementsByClassName("editWrapper");
const timerText = document.getElementById("timer");
const triggerButton = document.getElementById("trigger");
const resetButton = document.getElementById("reset");
const editButton = document.getElementById("edit");
const saveButton = document.getElementById("save");



triggerButton.addEventListener("click",(e)=>{
    if(triggerButton.textContent === "Pause"){
        triggerButton.textContent = "Start";
    }
    else{
        triggerButton.textContent = "Pause";
    }
})

saveButton.addEventListener("click",(e)=>{
    const hour = parseInt(document.getElementById("hour").value);
    const min  = parseInt(document.getElementById("min").value);
    const sec = parseInt(document.getElementById("sec").value);
    timerText.textContent = `${hour}:${min}:${sec}`;
})

resetButton.addEventListener("click",(e)=>{
    timerText.textContent = "0:00:00";
})

editButton.addEventListener('click',(e)=>{
    editWrapper.style.display = "block";
})