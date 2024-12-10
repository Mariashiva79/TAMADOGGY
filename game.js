let currentLanguage = 'es';

function translate(key) {
    return translations[currentLanguage][key] || key;
}

function updateLanguage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key);
    });
}

// Función para verificar si estamos en la página de inicio
function isHomePage() {
    return !document.querySelector('.pet-display');
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.addEventListener('change', (event) => {
            currentLanguage = event.target.value;
            updateLanguage();
        });
    }

    updateLanguage();

    // Si no estamos en la página de inicio, inicializa el juego
    if (!isHomePage()) {
        initializeGame();
    }
});

// Función para inicializar el juego (solo se llama en las páginas de mascotas)
function initializeGame() {
    // Aquí va todo el código existente del juego
    class Pet {
        constructor() {
            this.stats = {
                hunger: 100,
                fun: 100,
                cleanliness: 100,
                affection: 100,
            };
            this.decreaseInterval = setInterval(() => this.decreaseStats(), 700);
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
                showMessage(translate("gameOver"));
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

        // Add click/touch event for mobile devices
        item.addEventListener("click", e => {
            const action = item.getAttribute("data-action");
            pet.handleAction(action);
            showMessage(`${translate(action + "ing")} ${translate("yourPet")}!`);
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
        showMessage(`${translate(action + "ing")} ${translate("yourPet")}!`);
    });

    // Function to check if the device supports touch events
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

    // Disable drag and drop for touch devices
    if (isTouchDevice()) {
        draggableItems.forEach(item => {
            item.draggable = false;
        });
    }

    // Responsive design adjustments
    function adjustLayout() {
        if (isHomePage()) return;

        const container = document.querySelector('.container');
        const petSection = document.querySelector('.pet-section');
        const stats = document.querySelector('.stats');
        const petDisplay = document.querySelector('.pet-display');

        if (window.innerWidth <= 768) {
            container.style.padding = '10px';
            petSection.style.flexDirection = 'column';
            stats.style.width = '100%';
            if (window.innerWidth <= 320) {
                petDisplay.style.width = '250px';
                petDisplay.style.height = '250px';
            } else if (window.innerWidth <= 480) {
                petDisplay.style.width = '300px';
                petDisplay.style.height = '300px';
            } else {
                petDisplay.style.width = '400px';
                petDisplay.style.height = '400px';
            }
        } else {
            container.style.padding = '20px';
            petSection.style.flexDirection = 'row';
            stats.style.width = '200px';
            petDisplay.style.width = '500px';
            petDisplay.style.height = '500px';
        }
    }

    // Llama a adjustLayout al final de la inicialización del juego
    adjustLayout();
}


// Event listener para el cambio de tamaño de la ventana
window.addEventListener('resize', () => {
    if (!isHomePage()) {
        adjustLayout();
    }
});

