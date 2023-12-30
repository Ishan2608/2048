// get the game grid
const gridItems = [...document.querySelectorAll('.grid-item')];
const score_val = document.querySelector('.score-value');
const result = document.querySelector('.result');
var score = 0;
var moves = 0;
var moveFactor = 4
var options = [2, 4, 8, 2, 4, 8, 2, 2, 4, 4, 2, 8, 2, 2, 4, 4, 2];
var matrix = [];
var prevMatrix;
var currentMatrixValues;

var colors = ['#caf0f8', '#90e0ef', '#00b4d8', '#0077b6', '#03045e', '#023047', 
    '#fca311', '#14213d', '#e63946', '#ffc300', '#6a040f', '#000000']


// create the starting game grid.
let row = []
for (let index = 1; index < gridItems.length+1; index++) {
    if (index % 4 === 0){
        let item = gridItems[index-1]
        item.firstElementChild.innerText = ''
        row.push(item)
        matrix.push(row)
        row = []
    } else{   
        let item = gridItems[index-1]
        item.firstElementChild.innerText = ''
        row.push(item)
    }    
}

// assign any two grid blocks the value of 2
const rowIdx = Math.floor(Math.random() * 4)
const colIdx = Math.floor(Math.random() * 4)
let rowIdx2 = Math.floor(Math.random() * 4)
let colIdx2 = Math.floor(Math.random() * 4)

if (rowIdx === rowIdx2 && colIdx === colIdx2){
    rowIdx2 = Math.floor(Math.random() * 4)
    colIdx2 = Math.floor(Math.random() * 4)
}

matrix[rowIdx][colIdx].firstElementChild.textContent = 2
matrix[rowIdx2][colIdx2].firstElementChild.textContent = 2

var availIndexes = updateAvailIndexes()

updateColors()

// make web page able to listen to keydown event
document.addEventListener('keydown', moveBlocks)

// method to extract columns from an 2D array.
const arrayColumn = (arr, n) => arr.map((x) => x[n]);

// define the event listener
function moveBlocks(e){

    // if pressed key is not arrow key, return
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown'){
        return
    }

    // otherwise, move forward.
    moves++;
    currentMatrixValues = getCurrentMatrixValues();
    prevMatrix = currentMatrixValues;

    let col1 = arrayColumn(matrix, 0);
    let col2 = arrayColumn(matrix, 1);
    let col3 = arrayColumn(matrix, 2);
    let col4 = arrayColumn(matrix, 3);

    if (e.key === 'ArrowLeft'){
        moveLeft(matrix[0]) // row 1
        moveLeft(matrix[1]) // row 2
        moveLeft(matrix[2]) // row 3
        moveLeft(matrix[3]) // row 4
    }
    if (e.key === 'ArrowRight'){
        moveRight(matrix[0]) // row 1
        moveRight(matrix[1]) // row 2
        moveRight(matrix[2]) // row 3
        moveRight(matrix[3]) // row 4
    }
    if (e.key === 'ArrowUp'){
        moveLeft(col1)
        moveLeft(col2)
        moveLeft(col3)
        moveLeft(col4)
    }
    if (e.key === 'ArrowDown'){
        moveRight(col1)
        moveRight(col2)
        moveRight(col3)
        moveRight(col4)
    }

    currentMatrixValues = getCurrentMatrixValues();
    availIndexes = updateAvailIndexes();
    updateColors();

    let check = checkMatrixEquality(prevMatrix, currentMatrixValues);

    if (availIndexes.length === 0 && check === true){
        gameOver('loose');
    }

    if (moves % moveFactor === 0){
        generateNewBlock();
    }
}

// make sure that a new block is generate after every 8th second
setInterval(()=>{
    availIndexes = updateAvailIndexes();
    generateNewBlock();
}, 8000)

// after 12 s update options
setTimeout(()=>{
    options.push(8)
    options.push(16)
}, 12000)

// after 22 s update options
setTimeout(()=>{
    options.push(16)
    options.push(32)
}, 22000)

// after 30 s update options
setTimeout(()=>{
    options.push(16)
    options.push(32)
}, 30000)

// get the available empty indexes
function updateAvailIndexes(){
    matrixValues = getCurrentMatrixValues()
    let grid = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (matrixValues[i][j] == ''){
                grid.push([i, j])
            }
        }
    }
    return grid;
}

// get the current values of the matrix
function getCurrentMatrixValues(){
    // to convert node list to JS array, use destructuring.
    let gridItems = [...document.querySelectorAll('.grid-item')];
    let matrix_grid = []
    let row = []
    for (let index = 1; index < gridItems.length+1; index++) {
        if (index % 4 === 0){
            let item = gridItems[index-1]
            row.push(item.firstElementChild.innerText)
            matrix_grid.push(row)
            row = []
        } else{   
            let item = gridItems[index-1]
            row.push(item.firstElementChild.innerText)
        }    
    }
    return matrix_grid
}


// method to move elements of an array to left
function shiftLeft(arr){
    for (let i = 0; i < 4; i++) {
        for (let i = 1; i < 4; i++) {
            let currElement = arr[i].firstElementChild
            let prevElement = arr[i-1].firstElementChild
            if (prevElement.innerText == 0){
                prevElement.innerText = currElement.innerText
                currElement.innerText = ''
            }
        }
    }
}

// method to move elements of an array to right
function shiftRight(arr){
    for (let i = 0; i < 4; i++) {
        for (let i = 2; i >= 0; i--) {
            let currElement = arr[i].firstElementChild
            let nextElement = arr[i+1].firstElementChild
            if (nextElement.innerText == 0){
                nextElement.innerText = currElement.innerText
                currElement.innerText = ''
            }
        }
    }
}

// method to move element to right while summing them up
function moveRight(row){
    
    shiftRight(row)

    for (let i = 2; i >= 0; i--) {
        let currElement = row[i].firstElementChild
        let nextElement = row[i+1].firstElementChild
        let val = parseInt(currElement.innerText)
        let nextVal = parseInt(nextElement.innerText)
        if (val === nextVal && val !== 0){
            let newVal = val + nextVal
            nextElement.innerText = newVal 
            currElement.innerText = ''
            score = score + 2
            score_val.innerText = score
            if (newVal === 2048){
                gameOver('Win')
            }
        }    
    }

    shiftRight(row)

}


// method to move element to left while summing them up
function moveLeft(row){

    shiftLeft(row)

    for (let i = 1; i < 4; i++) {
        let currElement = row[i].firstElementChild
        let prevElement = row[i-1].firstElementChild
        let val = parseInt(currElement.innerText)
        let prevVal = parseInt(prevElement.innerText)
        if (val === prevVal && val !== 0){
            let newVal = val + prevVal
            prevElement.innerText = newVal 
            currElement.innerText = ''
            score = score + 2
            score_val.innerText = score
            if (newVal === 2048){
                gameOver('Win')
            }
        }  
    }

    shiftLeft(row)
}

// generate a new block, i.e., assign a random value from options to one of the available blocks
function generateNewBlock(){
    if (availIndexes.length !== 0){
        let randInt = Math.floor(Math.random() * availIndexes.length)
        let coords = availIndexes[randInt];
        let randInt3 = Math.floor(Math.random() * options.length)
        let ele = matrix[coords[0]][coords[1]].firstElementChild
        ele.innerText = options[randInt3]
        updateColors()
    }
}

// check if two matrices are equal or not.
function checkMatrixEquality(mat1, mat2){
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if (mat1[i][j] !== mat2[i][j]){
                return false;
            }
        }
    }
    return true
}

// update text content of result sections and show game over with its condition
function gameOver(status){
    if (status === 'Win'){
        result.innerText = 'You Won!!!';
        result.style.color = 'rgb(78, 236, 144)';
    } else {
        result.innerText = 'You Loose!!!';
        result.style.color = 'rgb(252, 51, 51)';
    }
}

// update colors of the blocks of the grid based on the text content
function updateColors(){
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let elem = matrix[i][j].firstElementChild
            if (elem.innerText == 0){
                elem.parentElement.style.backgroundColor = colors[0]
                elem.style.color = 'black'
            }
            else if (elem.innerText == 2){
                elem.style.color = 'black'
                elem.parentElement.style.backgroundColor = colors[1]
            } 
            else if (elem.innerText == 4){
                elem.style.color = 'black'
                elem.parentElement.style.backgroundColor = colors[2]
            } 
            else if (elem.innerText == 8){
                elem.style.color = 'black'
                elem.parentElement.style.backgroundColor = colors[3]
            } 
            else if (elem.innerText == 16){
                elem.style.color = 'white'
                elem.parentElement.style.backgroundColor = colors[4]
            }
            else if (elem.innerText == 32){
                elem.style.color = 'white'
                elem.parentElement.style.backgroundColor = colors[5]
            }
            else if (elem.innerText == 64){
                elem.style.color = 'white'
                elem.parentElement.style.backgroundColor = colors[6]
            }
            else if (elem.innerText == 128){
                elem.style.color = 'white'
                elem.parentElement.style.backgroundColor = colors[7]
            }
            else if (elem.innerText == 256){
                elem.style.color = 'white'
                elem.parentElement.style.backgroundColor = colors[8]
            }
            else if (elem.innerText == 512){
                elem.style.color = 'white'
                elem.parentElement.style.backgroundColor = colors[9]
            }
            else if (elem.innerText == 1024){
                elem.style.color = 'white'
                elem.parentElement.style.backgroundColor = colors[10]
            }
            else if (elem.innerText == 2048){
                elem.style.color = 'white'
                elem.parentElement.style.backgroundColor = colors[11]
            }
        }   
    }
}

