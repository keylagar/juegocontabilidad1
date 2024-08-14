let timerInterval;
let timeLeft = 120; // Cambiado a 120 segundos
let playerName = '';
let scores = {};
let currentLevel = 1;

const levels = [
    { categories: ['Activo'], accounts: [
        { name: 'Caja', type: 'Activo' },
        { name: 'Proveedores', type: '' }
    ]},
    { categories: ['Activo Corriente', 'Activo No Corriente'], accounts: [
        { name: 'Caja', type: 'Activo Corriente' },
        { name: 'Terrenos', type: 'Activo No Corriente' }
    ]},
    { categories: ['Pasivo'], accounts: [
        { name: 'Caja', type: '' },
        { name: 'Proveedores', type: 'Pasivo' }
    ]},
    { categories: ['Pasivo Corriente', 'Pasivo No Corriente'], accounts: [
        { name: 'Proveedores', type: 'Pasivo Corriente' },
        { name: 'Préstamos a largo plazo', type: 'Pasivo No Corriente' }
    ]},
    { categories: ['Patrimonio'], accounts: [
        { name: 'Capital Social', type: 'Patrimonio' }
    ]}
];

function startGame() {
    playerName = document.getElementById('playerName').value;
    if (!playerName) {
        alert('Por favor, ingresa tu nombre.');
        return;
    }

    document.getElementById('playerNamePrompt').style.display = 'none';
    document.getElementById('timer').style.display = 'block';
    document.getElementById('game').style.display = 'block';
    document.getElementById('categories').style.display = 'block';
    document.getElementById('restart').style.display = 'inline-block';
    document.getElementById('exit').style.display = 'inline-block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('result').innerHTML = '';
    document.getElementById('scoreTable').style.display = 'block';
    timeLeft = 120; // Cambiado a 120 segundos
    document.getElementById('time').innerText = timeLeft;
    clearInterval(timerInterval); // Asegúrate de limpiar cualquier intervalo anterior
    timerInterval = setInterval(countdown, 160000); // Configura el intervalo a 1000 ms (1 segundo)
    currentLevel = 1;
    loadLevel(currentLevel);
}

function countdown() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        checkResults();
    } else {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;

        const timerBar = document.getElementById('timerBar');
        const newWidth = (timeLeft / 120) * 100; // Ajustado para 120 segundos
        timerBar.style.width = newWidth + '%';

        if (timeLeft < 20) {
            timerBar.style.backgroundColor = 'red';
        } else if (timeLeft < 60) {
            timerBar.style.backgroundColor = 'orange';
        } else {
            timerBar.style.backgroundColor = 'green';
        }
    }
}

// Configuración inicial del contenedor y la barra de tiempo
const timerContainer = document.getElementById('timer');
timerContainer.style.position = 'relative';
timerContainer.style.width = '100%';
timerContainer.style.height = '30px';
timerContainer.style.backgroundColor = 'lightgray';
timerContainer.style.overflow = 'hidden';

const timerBar = document.createElement('div');
timerBar.id = 'timerBar';
timerBar.style.position = 'absolute';
timerBar.style.height = '100%';
timerBar.style.width = '100%';
timerBar.style.backgroundColor = 'green';
timerContainer.appendChild(timerBar);

const timeDisplay = document.getElementById('time');
timeDisplay.style.position = 'relative';
timeDisplay.style.zIndex = '1'; // Asegura que el texto esté por encima de la barra

// Resto del código...




function countdown() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        checkResults();
    } else {
        timeLeft--;
        timeDisplay.innerText = timeLeft;

        const percentage = (timeLeft / 120) * 100;
        timerBar.style.width = percentage + '%';

        if (timeLeft < 10) {
            timerBar.style.backgroundColor = 'red';
        } else if (timeLeft < 60) {
            timerBar.style.backgroundColor = 'orange';
        } else {
            timerBar.style.backgroundColor = 'green';
        }
    }
}





function loadLevel(level) {
    const levelData = levels[level - 1];
    generateAccounts(levelData.accounts);
    generateCategories(levelData.categories);
    document.getElementById('time').innerText = timeLeft; // Mantener el tiempo restante
    clearInterval(timer);
    timer = setInterval(countdown, 1000);
}

function generateAccounts(accounts) {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = '';
    accounts.forEach(account => {
        const div = document.createElement('div');
        div.className = 'account';
        div.draggable = true;
        div.ondragstart = drag;
        div.id = account.type + Math.random().toString(36).substr(2, 9);
        div.innerText = account.name;
        gameDiv.appendChild(div);
    });
}

function generateCategories(categories) {
    const categoriesDiv = document.getElementById('categories');
    categoriesDiv.innerHTML = '';
    categories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'category';
        div.ondrop = drop;
        div.ondragover = allowDrop;
        div.id = category;
        div.innerText = category;
        categoriesDiv.appendChild(div);
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const originalParent = draggedElement.parentNode;
    event.target.appendChild(draggedElement);
    draggedElement.style.display = 'inline-block'; // Asegura que el elemento arrastrado se muestre correctamente
    checkResults(originalParent); // Verificar resultados cada vez que se suelta un elemento
}

function checkResults(originalParent) {
    const levelData = levels[currentLevel - 1];
    let correct = 0;
    let totalCorrect = 0;
    let incorrect = 0;

    levelData.categories.forEach(category => {
        const categoryDiv = document.getElementById(category);
        const accounts = categoryDiv.getElementsByClassName('account');
        totalCorrect += levelData.accounts.filter(account => account.type === category).length;

        for (let account of accounts) {
            if (account.id.startsWith(category)) {
                account.classList.add('correct');
                correct++;
            } else {
                account.classList.add('incorrect');
                incorrect++;
                account.draggable = true; // Permitir que el elemento incorrecto sea arrastrado de nuevo
                originalParent.appendChild(account); // Devolver el elemento incorrecto a su ubicación original
                setTimeout(() => {
                    account.classList.remove('incorrect');
                    account.style.backgroundColor = ''; // Restablecer el color de fondo original
                    account.style.color = ''; // Restablecer el color del texto original
                    account.style.fontSize = ''; // Restablecer el tamaño de fuente original
                    account.style.transform = ''; // Restablecer el tamaño original
                }, 2000); // Mantener el color rojo durante 2 segundos
            }
        }
    });

    if (!scores[playerName]) {
        scores[playerName] = 0;
    }
    scores[playerName] += correct;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Correctas: ${correct}, Incorrectas: ${incorrect}`;
    resultDiv.style.display = 'block';

    if (correct === totalCorrect && incorrect === 0 && currentLevel < levels.length) {
        currentLevel++;
        const messageDiv = document.createElement('div');
        messageDiv.className = 'level-up-message';
        messageDiv.innerText = '¡Felicidades! Subes a otro nivel.';
        document.body.appendChild(messageDiv);
        setTimeout(() => {
            messageDiv.remove();
            loadLevel(currentLevel);
        }, 3000); // El mensaje se mostrará durante 3 segundos
    } else if (correct === totalCorrect && incorrect === 0) {
        updateScoreTable();
    }
}


function updateScoreTable() {
    const scoreBody = document.getElementById('scoreBody');
    scoreBody.innerHTML = '';
    for (const player in scores) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const scoreCell = document.createElement('td');
        nameCell.innerText = player;
        scoreCell.innerText = scores[player];
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        scoreBody.appendChild(row);
    }
}

function exitGame() {
    document.getElementById('playerNamePrompt').style.display = 'block';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('game').style.display = 'none';
    document.getElementById('categories').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    document.getElementById('exit').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    document.getElementById('scoreTable').style.display = 'none';
}

document.getElementById('timer').style.display = 'none';
document.getElementById('game').style.display = 'none';
document.getElementById('categories').style.display = 'none';
document.getElementById('restart').style.display = 'none';
document.getElementById('exit').style.display = 'none';
document.getElementById('scoreTable').style.display = 'none';

