//* --------------------
//* Preparation Phrase
//* --------------------

//querySelector get the first element in the document
const scoreCounter = document.querySelector('.score-counter');
const grid = document.querySelector('.grid');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again');


//Initialise variables needed for game setup
const totalCells = 100;
const totalBombs = 6;
const maxScore = totalCells - totalBombs;
const bombsList = [];

let score = 0;

//a loop generating every cells
for (let i = 1; i <= 100; i++) {
    const cell = document.createElement('div');// cell = <div></div>
    cell.classList.add('cell');//cell = <div class="cell"></div>

    //When a player click a cell:
    cell.addEventListener('click', function () {
        //console.log(`You clicked on cell number ${i}`);// Testing // ` ${i}` we can use the i variable.

        if (cell.classList.contains('cell-clicked')) { //avoid clicking a clicked cell
            return;
        }

        if (bombsList.includes(i)) { //clicked on a bomb
            cell.classList.add('cell-bomb');
            endGame(false);
        }
        cell.classList.add('cell-clicked');
        updateScore();



    })

    grid.appendChild(cell);
}

//generating the bomb's position
while (bombsList.length < totalBombs) {
    //Generate a random number between 1 and 100, inclusive
    const randomNumber = Math.floor(Math.random() * totalCells) + 1; //the +1 is for the case of random() giving zero.

    if (!bombsList.includes(randomNumber)) { //avoid a cell has more than one bomb
        bombsList.push(randomNumber);
    }

}
bombsList.sort();// not necessary but easy to know where the bomb are:3

playAgainButton.addEventListener('click', function () {
    window.location.reload();
})

//* -------------
//* Functions
//* -------------

function updateScore() {
    score++;
    scoreCounter.innerText = score.toString().padStart(5, '0');//padStart 5 digits starting with 0

    if (score === maxScore) {
        endGame(true);
    }
}

function endGame(isVictory) {
    if (isVictory) {
        endGameText.innerHTML = 'YOU<br />WON';
        endGameScreen.classList.add('win');
    } else {
        endGameText.innerHTML = 'YOU<br />LOSE';
        endGameScreen.classList.add('lose');
        revealAllBombs();
    }



    endGameScreen.classList.remove('hidden');
}

function revealAllBombs() {
    const cells = document.querySelectorAll('.cell');

    for (let i = 1; i <= cells.length; i++) {
        const cell = cells[i - 1];
        if (bombsList.includes(i)) {
            cell.classList.add('cell-bomb');
        }
    }
}



