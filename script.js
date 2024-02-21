//querySelector get the first element in the document
const scoreCounter = document.querySelector('.score-counter');
const grid = document.querySelector('.grid');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again');


//Game states
const totalCells = 100;
const totalBombs = 3;
const maxScore = 5;
const bombsList = [];

let score = 0;

function updateScore() {
    score++;
    scoreCounter.innerText = score.toString().padStart(5, '0');//padStart 5 digits starting with 0

    if (score === maxScore) {
        endGame(true);
    }
}

//a loop for generating every cells
for (let i = 1; i <= 100; i++) {
    const cell = document.createElement('div');// cell = <div></div>
    cell.classList.add('cell');//cell = <div class="cell"></div>

    cell.addEventListener('click', function () {
        //console.log(`You clicked on cell number ${i}`);// Testing // ` ${i}` we can use the i variable.

        if (bombsList.includes(i)) {
            cell.classList.add('cell-bomb');
            endGame(false);
        } else if (!cell.classList.contains('cell-clicked')) {
            cell.classList.add('cell-clicked');
            updateScore();
        }

    })

    grid.appendChild(cell);
}

while (bombsList.length < totalBombs) {
    //Generate a random number between 1 and 100, inclusive
    const randomNumber = Math.floor(Math.random() * totalCells) + 1; //the +1 is for the case of random() giving zero.

    if (!bombsList.includes(randomNumber)) {
        bombsList.push(randomNumber);
    }

}

function endGame(isVictory) {
    if (isVictory) {
        endGameText.innerHTML = 'YOU<br />WON';
        endGameScreen.classList.add('win');
    } else {
        endGameText.innerHTML = 'YOU<br />LOSE';
        endGameScreen.classList.add('lose');
    }



    endGameScreen.classList.remove('hidden');
}

playAgainButton.addEventListener('click', function () {
    window.location.reload();
})