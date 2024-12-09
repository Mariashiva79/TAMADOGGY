class Pet {
    constructor() {
        this.stats = {
            hunger: 100,
            fun: 100,
            cleanliness: 100,
            affection: 100,
        };
        this.decreaseInterval = setInterval(() => this.decreaseStats(), 100);
    }

    decreaseStats() {
        this.stats.hunger = Math.max(0, this.stats.hunger - 0.5);
        this.stats.fun = Math.max(0, this.stats.fun - 0.4);
        this.stats.cleanliness = Math.max(0, this.stats.cleanliness - 0.3);
        this.stats.affection = Math.max(0, this.stats.affection - 0.2);
        this.updateBars();
        this.checkStatus();
    }

    updateBars() {
        for (let stat in this.stats) {
            const percentage = Math.round(this.stats[stat]);
            document.getElementById(`${stat}Bar`).style.width = `${percentage}%`;
            document.getElementById(`${stat}Percent`).textContent = `${percentage}%`;
        }
    }

    checkStatus() {
        const petImage = document.getElementById("petImage");
        const states = ["hungry", "bored", "dirty", "sad"];
        states.forEach(state => petImage.classList.remove(state));

        const lowestStat = Object.entries(this.stats).reduce((min, stat) => stat[1] < min[1] ? stat : min);
        
        if (lowestStat[1] < 70) {
            switch (lowestStat[0]) {
                case 'hunger':
                    petImage.classList.add("hungry");
                    break;
                case 'fun':
                    petImage.classList.add("bored");
                    break;
                case 'cleanliness':
                    petImage.classList.add("dirty");
                    break;
                case 'affection':
                    petImage.classList.add("sad");
                    break;
            }
        }

        if (Object.values(this.stats).some(stat => stat === 0)) {
            clearInterval(this.decreaseInterval);
            showMessage("GAME OVER. Please refresh the page to start again.");
        }
    }

    handleAction(action) {
        switch (action) {
            case "feed":
                this.stats.hunger = Math.min(100, this.stats.hunger + 20);
                break;
            case "play":
                this.stats.fun = Math.min(100, this.stats.fun + 20);
                this.stats.hunger = Math.max(0, this.stats.hunger - 5);
                break;
            case "clean":
                this.stats.cleanliness = Math.min(100, this.stats.cleanliness + 20);
                break;
            case "pet":
                this.stats.affection = Math.min(100, this.stats.affection + 20);
                this.stats.fun = Math.min(100, this.stats.fun + 5);
                break;
        }
        this.updateBars();
        this.checkStatus();
    }
}

const pet = new Pet();

function showMessage(message) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;
    messageElement.style.opacity = "1";
    setTimeout(() => {
        messageElement.style.opacity = "0";
    }, 2000);
}

// Drag and drop functionality
const petImage = document.getElementById("petImage");
const draggableItems = document.querySelectorAll(".draggable");

draggableItems.forEach(item => {
    item.addEventListener("dragstart", e => {
        e.dataTransfer.setData("action", item.getAttribute("data-action"));
    });
});

petImage.addEventListener("dragover", e => {
    e.preventDefault();
    petImage.classList.add("drag-over");
});

petImage.addEventListener("dragleave", () => {
    petImage.classList.remove("drag-over");
});

petImage.addEventListener("drop", e => {
    e.preventDefault();
    petImage.classList.remove("drag-over");
    const action = e.dataTransfer.getData("action");
    pet.handleAction(action);
    showMessage(`${action.charAt(0).toUpperCase() + action.slice(1)}ing your pet!`);
});