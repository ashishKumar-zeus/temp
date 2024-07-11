
class Heading {
    constructor(x, y, width = 100, height = 30, isSelected = false, data = '') {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isSelected = isSelected;
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}


class DoublyLinkedList {
    constructor(count, value, width, height, isHLL) {
        this.head = null;
        this.tail = null;
        this.width = width;
        this.height = height;

        this.initializeList(count, value, width, height, isHLL);
    }

    initializeList(count, value, width, height, isHLL) {
        let x = 0;
        let y = 0;

        if (isHLL) {

            for (let i = 0; i < count; i++) {
                // console.log(x,y,width,height,false,value)
                this.addElement(x, y, width, height, false, value);
                x += width;
            }
        }
        else {

            for (let i = 0; i < count; i++) {
                this.addElement(x, y, width, height, false, value);
                y += height;
            }
        }

        this.printList()
    }

    // Add an element to the end of the list
    addElement(x, y, width, height, isSelected, data) {
        const newNode = new Heading(x, y, width, height, isSelected, data);
        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    // Print the list
    printList() {
        let current = this.head;
        const elements = [];
        while (current) {
            console.log(current)

            elements.push(current);
            current = current.next;

        }

    }

}

let HLL = new DoublyLinkedList(20, "column", 100, 30, true);
let VLL = new DoublyLinkedList(20, "row", 50, 30, false);


class Cell {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.right = null;
        this.bottom = null;
        this.top = null;
        this.left = null;
    }
}

class Grid {
    constructor(rows, cols, cellHeight, cellWidth) {
        this.head = null;
        this.rows = rows;
        this.cols = cols;
        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.createGrid();
        this.printCol();
        console.log("printrow")
        this.printRow()

    }

    // Create the grid with the specified rows and columns
    createGrid() {
        let previousRowStart = null;
        let previousCell = null;

        for (let i = 0; i < this.rows; i++) {
            let currentRowStart = null;
            previousCell = null;
            let previousRowElement = previousRowStart;
            for (let j = 0; j < this.cols; j++) {
                
                const newCell = new Cell(j * this.cellWidth, i * this.cellHeight, this.cellHeight, this.cellWidth);

                if (!this.head) {
                    this.head = newCell;
                }

                if (!currentRowStart) {
                    currentRowStart = newCell;
                }

                if (previousCell) {
                    previousCell.right = newCell;
                    newCell.left = previousCell;
                }

                if (previousRowStart) {
                    let temp = previousRowElement;
                    // for (let k = 0; k < j; k++) {
                    //     temp = temp.right;
                    // }
                    temp.bottom = newCell;
                    newCell.top = temp;
                    previousRowElement = previousRowElement.right;
                }

                previousCell = newCell;
            }
            previousRowStart = currentRowStart;
        }
    }

    // Print the grid
    printRow() {
        let rowStart = this.head;
        while (rowStart) {
            let current = rowStart;
            let row = [];
            while (current) {
                row.push(`[${current.x},${current.y}]`);
                current = current.right;
            }
            console.log(row.join(' -> '));
            rowStart = rowStart.bottom;
        }
    }
    printCol(){
        let colstart = this.head;
        while (colstart){
            let current = colstart
            let col = []
            while (current) {
                col.push(`[${current.x},${current.y}]`);
                current = current.bottom;
            }
            console.log(col.join(' -> '));
            colstart = colstart.right;

        }
    }
    

}





const MLL = new Grid(20, 10, 30, 100);
