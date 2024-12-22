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

    // Inicializar la sección de puntuaciones
    initializeScoreSection();
});

// Función para inicializar el juego (solo se llama en las páginas de cada perro)
function initializeGame() {
    class Pet {
        constructor() {
            this.stats = {
                hunger: 100,
                fun: 100,
                cleanliness: 100,
                affection: 100,
            };
            this.happyTime = 0;
            this.lastUpdateTime = Date.now();
            this.decreaseInterval = setInterval(() => this.updateStats(), 700);
        }

        updateStats() {
            const currentTime = Date.now();
            const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // tiempo en segundos

            this.stats.hunger = Math.max(0, this.stats.hunger - 0.5 * deltaTime);
            this.stats.fun = Math.max(0, this.stats.fun - 0.4 * deltaTime);
            this.stats.cleanliness = Math.max(0, this.stats.cleanliness - 0.3 * deltaTime);
            this.stats.affection = Math.max(0, this.stats.affection - 0.2 * deltaTime);

            if (this.isHappy()) {
                this.happyTime += deltaTime;
                this.updateScoreDisplay();
            }

            this.lastUpdateTime = currentTime;
            this.updateBars();
            this.checkStatus();
        }

        isHappy() {
            return Object.values(this.stats).every(stat => stat >= 70);
        }

        updateBars() {
            for (let stat in this.stats) {
                const percentage = Math.round(this.stats[stat]);
                const barElement = document.getElementById(`${stat}Bar`);
                const percentElement = document.getElementById(`${stat}Percent`);
                if (barElement) {
                    barElement.style.width = `${percentage}%`;
                }
                if (percentElement) {
                    percentElement.textContent = `${percentage}%`;
                }
            }
        }

        updateScoreDisplay() {
            const scoreElement = document.getElementById('currentScore');
            if (scoreElement) {
                scoreElement.textContent = Math.round(this.happyTime)*100;
            }
        }

        checkStatus() {
            const petImage = document.getElementById("petImage");
            if (!petImage) return;

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
                this.saveScore();
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
            this.updateStats();
        }

        saveScore() {
            const username = document.getElementById('username').value;
            if (username) {
                sendScore(username, Math.round(this.happyTime)*100);
            } else {
                showMessage(translate("enterUsername"));
            }
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

// Funciones para manejar puntuaciones
function initializeScoreSection() {
    const scoreForm = document.getElementById('scoreForm');
    if (scoreForm) {
        scoreForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const score = document.getElementById('currentScore').innerText;
            console.log(username, score);
            
            
            if (username) {
                sendScore(username, score);
            } else {
                showMessage(translate("enterUsername"));
            }
        });
    }
    getAllScores();
}

function sendScore(username, score) {
    fetch('/api/save-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, score }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
       // showMessage(translate("scoreSaved"));
        getAllScores();
    })
    .catch(error => console.error('Error:', error));
}

function getAllScores() {
    fetch('/api/all-scores')
    .then(response => response.json())
    .then(scores => {
        const scoreList = document.getElementById('scoreList');
        if (scoreList) {
            scoreList.innerHTML = '';
            for (const [username, score] of Object.entries(scores)) {
                const li = document.createElement('li');
                li.textContent = `${username}: ${score} ${translate("points")}`;
                scoreList.appendChild(li);
            }
        }
    })
    .catch(error => console.error('Error:', error));
}





