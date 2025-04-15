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
    console.log(toggleButton);
})


resetButton.addEventListener("click",()=>{
    console.log(resetButton);
})

editButton.addEventListener("click",()=>{
    editContainer.classList.toggle("hidden");

})



// Event Handlers Edit Area
saveButton.addEventListener("click",()=>{
    editContainer.classList.toggle("hidden");
})