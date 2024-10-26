const gameBoard = document.getElementById('gameBoard');
const resetButton = document.getElementById('resetButton');
const bestTimesList = document.getElementById('best-times');
const difficultySelect = document.getElementById('difficulty');

let currentPlayer = 'X';
let gameActive = true;
let startTime;

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function createBoard() {
  gameBoard.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.style.backgroundColor = randomColor();
    cell.addEventListener('click', handleCellClick);
    gameBoard.appendChild(cell);
  }
}

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function handleCellClick(e) {
  const cell = e.target;
  if (!gameActive || cell.textContent) return;

  cell.textContent = currentPlayer;
  checkWinner();

  if (gameActive) {
    setTimeout(() => computerMove(difficultySelect.value), 500);
  }
}

function computerMove(difficulty) {
  const availableCells = [...document.querySelectorAll('.cell')].filter(cell => !cell.textContent);
  if (availableCells.length === 0) return;

  let selectedCell;

  if (difficulty === 'easy') {
    selectedCell = randomCell(availableCells);
  } else if (difficulty === 'medium') {
    selectedCell = findWinningMove('O') || randomCell(availableCells);
  } else if (difficulty === 'hard') {
    selectedCell = 
      findWinningMove('O') || 
      findWinningMove('X') || 
      randomCell(availableCells);
  }

  selectedCell.textContent = 'O';
  checkWinner(false); // Llamada sin mensaje de victoria
}

function randomCell(availableCells) {
  return availableCells[Math.floor(Math.random() * availableCells.length)];
}

function findWinningMove(player) {
  const cells = document.querySelectorAll('.cell');
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    const values = [cells[a].textContent, cells[b].textContent, cells[c].textContent];
    if (values.filter(v => v === player).length === 2 && values.includes('')) {
      return cells[condition[values.indexOf('')]];
    }
  }
  return null;
}

function checkWinner(playerWin = true) {
  const cells = document.querySelectorAll('.cell');
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (cells[a].textContent && 
        cells[a].textContent === cells[b].textContent &&
        cells[a].textContent === cells[c].textContent) {
      gameActive = false;

      if (playerWin && cells[a].textContent === 'X') {
        alert(`¡Ganaste!`);
        saveBestTime();
      } else if (!playerWin) {
        alert('¡Perdiste!');
      }
      return;
    }
  }

  if ([...cells].every(cell => cell.textContent)) {
    gameActive = false;
    alert('¡Empate!');
  }
}

function saveBestTime() {
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  const playerName = prompt('¡Ganaste! Ingresa tu nombre:');
  const bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || [];
  bestTimes.push({ name: playerName, time: timeTaken, date: new Date().toLocaleString() });
  bestTimes.sort((a, b) => a.time - b.time);
  localStorage.setItem('bestTimes', JSON.stringify(bestTimes.slice(0, 10)));
  displayBestTimes();
}

function displayBestTimes() {
  const bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || [];
  bestTimesList.innerHTML = bestTimes.map(entry => 
    `<li>${entry.name} - ${entry.time}s - ${entry.date}</li>`).join('');
}

resetButton.addEventListener('click', () => {
  gameActive = true;
  currentPlayer = 'X';
  startTime = new Date();
  createBoard();
});

createBoard();
displayBestTimes();
