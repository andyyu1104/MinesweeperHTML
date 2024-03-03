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
const totalBombs = 12;
const maxScore = totalCells - totalBombs;
const bombsList = [];
const clickSound = new Audio('./sfx/dig.wav');
const mineExplodedSound = new Audio('./sfx/mineExploded.wav');

let score = 0;

//a loop generating every cells
for (let i = 1; i <= 100; i++) {
    const cell = document.createElement('div');// cell = <div></div>
    cell.classList.add('cell');//cell = <div class="cell"></div>

    //When a player right click a cell
    cell.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        if (cell.classList.contains('cell-clicked')) { //avoid clicking a clicked cell
            return;
        }
        flag(i);

        //cell.classList.add('cell-flag');
    })

    //When a player click a cell:
    cell.addEventListener('click', function () {
        //console.log(`You clicked on cell number ${i}`);// Testing // ` ${i}` we can use the i variable.

        if (cell.classList.contains('cell-clicked') || cell.classList.contains('cell-flag')) { //avoid clicking a clicked cell and flagged cell
            return;
        }

        if (bombsList.includes(i)) { //clicked on a bomb
            mineExplodedSound.play();
            cell.classList.add('cell-bomb');
            endGame(false);
        } else {
            //two lines below will be perfromed in revealNumbersofBomb()
            //cell.classList.add('cell-clicked'); 
            //updateScore();

            //countSurroundingMine(i);
            clickSound.play();
            revealNumbersofBomb(i);
        }


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
bombsList.sort();// not necessary but easy to read where the bomb are:3

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
        revealAllBombs();
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

//challenging task: check number of surrounding mines
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
    return foundBombs;

    //console.log(`You clicked on cell number ${cellIndex}, with ${foundBombs} bombs`);

}

function revealNumbersofBomb(cellIndex) {
    const cell = document.querySelectorAll('.cell')[cellIndex - 1];

    //the function will return when the current index is out of grid, a bomb and clicked before. 
    if (cellIndex < 1 || cellIndex > 100 || bombsList.includes(cellIndex) || cell.classList.contains('cell-clicked') || cell.classList.contains('cell-flag')) {
        return;
    }

    numOfbombs = countSurroundingMine(cellIndex);
    cell.classList.add('cell-clicked');
    updateScore();
    if (numOfbombs !== 0) {
        cell.innerText = numOfbombs; //reveal the number on the html
    } else {
        flood(cellIndex);
    }
}

//flood fill algorithm(DFS approach)
function flood(cellIndex) {
    //flood to the top
    revealNumbersofBomb(cellIndex - 10);

    //flood to the right if current index has not reached the end of the border
    if (cellIndex % 10 !== 0) {
        revealNumbersofBomb(cellIndex - 9);
        revealNumbersofBomb(cellIndex + 1);
        revealNumbersofBomb(cellIndex + 11);
    }

    //flood to the left if current index has not reached the end of the border
    if (cellIndex % 10 !== 1) {
        revealNumbersofBomb(cellIndex - 11);
        revealNumbersofBomb(cellIndex - 1);
        revealNumbersofBomb(cellIndex + 9);
    }

    revealNumbersofBomb(cellIndex + 10);

}

function flag(cellIndex) {
    const cell = document.querySelectorAll('.cell')[cellIndex - 1];
    if (!cell.classList.contains('cell-flag')) {
        cell.classList.add('cell-flag');
    } else {
        cell.classList.remove('cell-flag');
    }
}