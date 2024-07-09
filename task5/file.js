const canvas = document.getElementById('spreadsheetCanvas');
const ctx = canvas.getContext('2d');

const cellInput = document.getElementById('cellInput');
const div = document.querySelector('.mainContainer');

const rect = canvas.getBoundingClientRect();



class cell {
    constructor(value) {
        this.isSelected = false;
        this.value = value
    }
}


const CELL_HEIGHT = 30;
const CELL_WIDTH = 100;
let ROWS = 100;
let COLS = 20;

let data = [];

let columnWidths;

// let data = Array(ROWS).fill().map(() => Array(COLS).fill(''));

function populateArr(COLS,ROWS) {
    
    columnWidths = Array(COLS).fill(100);

    data = []

    for (let i = 0; i < ROWS; i++) {
        const row = [];
        for (let j = 0; j < COLS; j++) {
            row.push(new cell(`${i},${j}`));
        }
        data.push(row);
    }
}

function drawGrid() {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    console.log("creating cols from 0 to ",COLS)

    let x = 0;
    for (let j = 0; j <= COLS; j++) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ROWS * CELL_HEIGHT);
        ctx.stroke();
        if (j < COLS) x += columnWidths[j];
    }

    for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_HEIGHT);
        ctx.lineTo(canvas.width, i * CELL_HEIGHT);
        ctx.stroke();
    }
}

function drawCellContents() {
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';

    let x = 0;
    for (let j = 0; j < COLS; j++) {
        for (let i = 0; i < ROWS; i++) {
            ctx.fillText("a", x + 5, i * CELL_HEIGHT + CELL_HEIGHT / 2);
            // if(data[i][j].value){
            //     ctx.fillText(data[i][j].value, x + 5, i * CELL_HEIGHT + CELL_HEIGHT / 2);
            // }
        }
        x += columnWidths[j];
    }
}





function render() {
    populateArr(COLS,ROWS)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawCellContents();
}

function renderOnly(x, y, width, height) {

    ctx.clearRect(x, y, width, height);
    drawGrid();
    drawCellContents();
}


function getColumnNumber(x) {
    let accumulatedWidth = 0;
    for (let i = 0; i < COLS; i++) {
        accumulatedWidth += columnWidths[i];
        if (x < accumulatedWidth) return i;
    }
    return -1;
}


function getRowNumber(y) {
    return Math.floor(y / CELL_HEIGHT);
}

let isSelecting = false;
let startYTop = -1;
let startXTop = -1;
let startYBottom = -1;
let startXBottom = -1;
let endYTop = -1;
let endXTop = -1;
let endYBottom = -1;
let endXBottom = -1;


function getTopLeftBottomRight(xPos, yPos) {
    const topLeftPosVertical = Math.floor(yPos / CELL_HEIGHT) * CELL_HEIGHT;
    const bottomRightPosVertical = Math.floor(yPos / CELL_HEIGHT) * CELL_HEIGHT + CELL_HEIGHT;

    let topLeftPosHorizontal = 0;
    let bottomRightPosHorizontal = 0;

    // console.log(xPos);

    let accumulatedWidth = 0;
    for (let i = 0; xPos > accumulatedWidth; i++) {
        accumulatedWidth += columnWidths[i];
        if (xPos <= accumulatedWidth) {
            bottomRightPosHorizontal = accumulatedWidth;
            topLeftPosHorizontal = accumulatedWidth - columnWidths[i];
        }
    }
    return [topLeftPosHorizontal, topLeftPosVertical, bottomRightPosHorizontal, bottomRightPosVertical];
}
let isSelected;

canvas.addEventListener('mousedown', (e) => {
    isSelecting = true;
    isSelected = false;
    const xPos = e.clientX - rect.left + div.scrollLeft;
    const yPos = e.clientY - rect.top + div.scrollTop;
    [startXTop, startYTop, startXBottom, startYBottom] = getTopLeftBottomRight(xPos, yPos);


    canvas.addEventListener('mousemove', (e) => {

        isSelected = true;

        if (isSelecting) {

            const xPos = e.clientX - rect.left + div.scrollLeft;
            const yPos = e.clientY - rect.top + div.scrollTop;


            if (Math.abs(yPos - prevYPos) > 25 || Math.abs(xPos - prevXPos) > 25) {
                [endXTop, endYTop, endXBottom, endYBottom] = getTopLeftBottomRight(xPos, yPos);

                startX = Math.min(startXTop, endXTop);
                startY = Math.min(startYTop, endYTop);
                endX = Math.max(startXBottom, endXBottom);
                endY = Math.max(startYBottom, endYBottom);

                makeRect(startX, startY, endX, endY);

                prevXPos = xPos;
                prevYPos = yPos;

            }


        }
    }

    )

    canvas.addEventListener("mouseup", (e) => {

        isSelecting = false;

    })


})

function makeRect(startX, startY, endX, endY) {
    render();
    ctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
    ctx.fillRect(startX, startY, endX - startX, endY - startY);
    ctx.strokeStyle = 'rgb(0, 100, 255)';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);

}

let prevXPos = 0;
let prevYPos = 0;



canvas.addEventListener('click', (e) => {

    const xPos = e.clientX - rect.left + div.scrollLeft;
    const yPos = e.clientY - rect.top + div.scrollTop;
    const colInd = getColumnNumber(xPos);
    const rowInd = getRowNumber(yPos);

    const [cellLeft, cellTop] = getTopLeftBottomRight(xPos, yPos);


    if (!isSelecting && !isSelected) {


        cellInput.style.display = "block";
        cellInput.style.top = cellTop + 'px';
        cellInput.style.left = cellLeft + 'px';
        cellInput.style.height = CELL_HEIGHT + 'px';
        cellInput.style.width = (columnWidths[getColumnNumber(xPos)]) + 'px';

        cellInput.value = data[rowInd][colInd].value;
        render();
        cellInput.focus();

        cellInput.onblur = () => {
            data[rowInd][colInd].value = cellInput.value;
            cellInput.style.display = "none";
            render();
        }

        isSelected = false;

    }
});


function drawGrid2(x,y,row,col) {
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;


    for (let j = 0; j <= col; j++) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, row * CELL_HEIGHT);
        ctx.stroke();
        if (j < col) x += columnWidths[j];
    }

    for (let i = 0; i <= row; i++) {
        ctx.beginPath();
        ctx.moveTo(y, i * CELL_HEIGHT);
        ctx.lineTo(canvas.width, i * CELL_HEIGHT);
        ctx.stroke();
    }
}

function render2(x,y,row,col) {
    console.log(x, y, canvas.width-500, canvas.height-500)
    ctx.clearRect(x, y, 10, 10);
    drawGrid2(x+500,y+500,row,col);
    // drawCellContents();
}


let scrollLeft = div.scrollLeft;
div.addEventListener("scroll",((e)=>{
    const currScrollLeft = div.scrollLeft;
    console.log(div.scrollLeft,div.scrollTop)

    if(currScrollLeft > scrollLeft+400){
        scrollLeft = currScrollLeft;
        COLS+=10;
        canvas.width+= 100;
        columnWidths=Array(COLS).fill(100);
        console.log(columnWidths)
        render2(div.scrollLeft,div.scrollTop,ROWS,10);
    }


}))


render();