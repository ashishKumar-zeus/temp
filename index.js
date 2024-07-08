
const canvas = document.getElementById('spreadsheetCanvas');
const ctx = canvas.getContext('2d');
const cellInput = document.getElementById('cellInput');
const div = document.querySelector('.mainContainer');


const CELL_HEIGHT = 30;
const ROWS = 100;
const COLS = 100;

let columnWidths = Array(COLS).fill(100);
let data = Array(ROWS).fill().map(() => Array(COLS).fill(''));

function drawGrid() {
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;

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


  // ctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
  // ctx.fillRect(0, 0, 200,200);
  // ctx.strokeStyle = 'rgb(0, 100, 255)';
  // ctx.lineWidth = 2;
  // ctx.strokeRect(startX, startY, endX - startX, endY - startY);


}

function drawCellContents() {
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';

  let x = 0;
  for (let j = 0; j < COLS; j++) {
    for (let i = 0; i < ROWS; i++) {
      ctx.fillText(data[i][j], x + 5, i * CELL_HEIGHT + CELL_HEIGHT / 2);
    }
    x += columnWidths[j];
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawCellContents();
}

function getColumn(x) {
  let accumulatedWidth = 0;
  for (let i = 0; i < COLS; i++) {
    accumulatedWidth += columnWidths[i];
    if (x < accumulatedWidth) return i;
  }
  return -1;
}

function getRow(y) {
  return Math.floor(y / CELL_HEIGHT);
}

function getRowTopPosition(yInd) {
  return yInd * CELL_HEIGHT + div.scrollTop;
}
function getRowBottomPosition(yInd) {
  return yInd * CELL_HEIGHT + CELL_HEIGHT + div.scrollTop;
}

function getColumnLeftPosition(col) {
  let x = 0;
  for (let i = 0; i < col; i++) {
    x += columnWidths[i];
  }
  return x+div.scrollLeft;
}

function getColumnRightPosition(col) {
  let x = 0;
  for (let i = 0; i < col + 1; i++) {
    x += columnWidths[i];
  }
  return x+div.scrollLeft;
}

// canvas.addEventListener('mousedown', (e) => {
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const col = getColumnAtX(x);

//     if (col > 0 && Math.abs(x - getColumnLeftPosition(col)) < RESIZE_HANDLE_WIDTH / 2) {
//         isResizing = true;
//         resizingColumn = col - 1;
//         canvas.style.cursor = 'col-resize';
//     }
// });

// canvas.addEventListener('mousemove', (e) => {
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;

//     if (isResizing) {
//         const newWidth = x - getColumnLeftPosition(resizingColumn);
//         if (newWidth > 10) {  // Minimum column width
//             columnWidths[resizingColumn] = newWidth;
//             render();
//         }
//     } else {
//         const col = getColumnAtX(x);
//         if (col > 0 && Math.abs(x - getColumnLeftPosition(col)) < RESIZE_HANDLE_WIDTH / 2) {
//             canvas.style.cursor = 'col-resize';
//         } else {
//             canvas.style.cursor = 'default';
//         }
//     }
// });

// canvas.addEventListener('mouseup', () => {
//     isResizing = false;
//     resizingColumn = -1;
//     canvas.style.cursor = 'default';
// });

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

  console.log(xPos);

  let accumulatedWidth = 0;
  for (let i = 0; xPos > accumulatedWidth; i++) {
    accumulatedWidth += columnWidths[i];
    if (xPos <= accumulatedWidth) {
      bottomRightPosHorizontal = accumulatedWidth;
      topLeftPosHorizontal = accumulatedWidth - columnWidths[i];
    }
  }
  // console.log(topLeftPosHorizontal, topLeftPosVertical, bottomRightPosHorizontal, bottomRightPosVertical)
  return [topLeftPosHorizontal, topLeftPosVertical, bottomRightPosHorizontal, bottomRightPosVertical];
}

canvas.addEventListener('mousedown', (e) => {
  isSelecting = true;
  console.log("true")

  const xPos = e.clientX - canvas.offsetLeft + div.scrollLeft;
  const yPos = e.clientY - canvas.offsetTop + div.scrollTop;

  [startXTop, startYTop, startXBottom, startYBottom] = getTopLeftBottomRight(xPos, yPos);

})

canvas.addEventListener("mouseup", (e) => {
  isSelecting = false;

})

function makeRect(startX, startY, endX, endY) {
  console.log(startX, startY, endX, endY)
  render();
  ctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
  ctx.fillRect(startX, startY, endX - startX, endY - startY);
  ctx.strokeStyle = 'rgb(0, 100, 255)';
  ctx.lineWidth = 2;
  ctx.strokeRect(startX, startY, endX - startX, endY - startY);

}

canvas.addEventListener('mousemove', (e) => {
  if (isSelecting) {

    const div = document.querySelector('.mainContainer');
    const xPos = e.clientX - canvas.offsetLeft + div.scrollLeft;
    const yPos = e.clientY - canvas.offsetTop + div.scrollTop;

    if (Math.abs(yPos - startYBottom) > 10 || Math.abs(xPos - startXBottom) > 30) {
      [endXTop, endYTop, endXBottom, endYBottom] = getTopLeftBottomRight(xPos, yPos);
      // console.log("here")

      // console.log(endXTop,endYTop,endXBottom,endYBottom)

      startX = Math.min(startXTop, endXTop);
      startY = Math.min(startYTop, endYTop);
      endX = Math.max(startXBottom, endXBottom);
      endY = Math.max(startYBottom, endYBottom);

      makeRect(startX, startY, endX, endY);

    }


  }
})



canvas.addEventListener('click', (e) => {
  if (!isSelecting) {

    const div = document.querySelector('.mainContainer');
    isSelecting = false;

    console.log(div.scrollLeft, div.scrollTop)

    const xPos = e.clientX - canvas.offsetLeft ;
    const yPos = e.clientY - canvas.offsetTop;
    console.log(xPos,yPos)


    // console.log(xPos, yPos)
    const xInd = getColumn(xPos);
    const yInd = getRow(yPos);

    // console.log(xInd, yInd)

    const cellTop = getRowTopPosition(yInd);
    const cellLeft = getColumnLeftPosition(xInd);
    if (!isSelecting) {

      cellInput.style.display = "block";
      cellInput.style.top = cellTop + 'px';
      cellInput.style.left = cellLeft + 'px';
      cellInput.style.height = CELL_HEIGHT + 'px';
      cellInput.style.width = (columnWidths[getColumn(xPos) - 1]) + 'px';
      cellInput.value = data[yInd][xInd];
      data[yInd][xInd] = "";
      render();
      cellInput.focus();

      cellInput.onblur = () => {
        data[yInd][xInd] = cellInput.value;
        cellInput.style.display = "none";
        render();
      }

    }
  }
});

render();
