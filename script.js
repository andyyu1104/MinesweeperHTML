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

        //countSurroundingMine(i);
        revealNumbersofBomb(i);

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

//challenging task
function countSurroundingMine(cellIndex) {
    //const curCell = document.querySelectorAll('.cell')[cellIndex - 1];
    let isTop;
    let isLeft;
    let isRight;
    let isBottom;

    if (cellIndex < 11) {
        isTop = true;
    }
    if (cellIndex > 90) {
        isBottom = true;
    }
    if (cellIndex % 10 === 1) {
        isLeft = true;
    }
    if (cellIndex % 10 === 0) {
        isRight = true;
    }

    const NW = cellIndex - 11;
    const N = cellIndex - 10;
    const NE = cellIndex - 9;
    const W = cellIndex - 1;
    const E = cellIndex + 1;
    const SW = cellIndex + 9;
    const S = cellIndex + 10;
    const SE = cellIndex + 11;

    let checkList = [];
    if (isLeft && isTop) {
        checkList.push(E, S, SE);
    } else if (isRight && isTop) {
        checkList.push(W, SW, S);
    } else if (isLeft && isBottom) {
        checkList.push(N, NE, E);
    } else if (isRight && isBottom) {
        checkList.push(NW, N, W);
    } else if (isRight) {
        checkList.push(NW, N, W, SW, S);
    } else if (isLeft) {
        checkList.push(NE, N, E, SE, S);
    } else {
        checkList.push(NW, N, NE, W, E, SW, S, SE);
    }

    let foundBombs = checkList.filter((dir) => bombsList.includes(dir)).length;
    if (foundBombs) {
        return foundBombs;
    } else {
        return 0;
    }

    //console.log(`You clicked on cell number ${cellIndex}, with ${foundBombs} bombs`);

}

function revealNumbersofBomb(cellIndex) {
    const cell = document.querySelectorAll('.cell')[cellIndex - 1]
    cell.innerText = countSurroundingMine(cellIndex);
}


