"use strict";
const app = new PIXI.Application({ 'height': 600, 'width': 600, 'backgroundColor': '#FCFCF4' });
document.body.querySelector("#pixicanvas").appendChild(app.view);

//#region Constants
const WIDTH = app.view.width;
const HEIGHT = app.view.height;
const CELLSIZE = 50; //px

const blockShapes = [
    [//numForms: 1
        [1]
    ],
    [//numForms: 2
        [1],
        [1]
    ],
    [//numForms: 2
        [1],
        [1],
        [1]
    ],
    [//numForms: 2
        [1],
        [1],
        [1],
        [1]
    ],
    [//numForms: 2
        [1],
        [1],
        [1],
        [1],
        [1]
    ],
    [//numForms: 2
        [0, 1],
        [1, 0]
    ],
    [//numForms: 2
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0]
    ],
    [//numForms: 4
        [1, 0],
        [1, 1]
    ],
    [//numForms: 4
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 1]
    ],
    [//numForms: 4
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [//numForms: 4
        [0, 1, 0],
        [1, 1, 1]
    ],
    [//numForms: 4
        [1, 1],
        [1, 0],
        [1, 1]
    ],
    [//numForms: 4
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    [//numForms: 4
        [0, 1],
        [0, 1],
        [1, 1]
    ],
    [//numForms: 4
        [1, 1, 0],
        [0, 1, 1]
    ],
    [//numForms: 4
        [0, 1, 1],
        [1, 1, 0]
    ],
    [//numForms: 1
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [//numForms: 1
        [1, 1],
        [1, 1]
    ]
];
//#endregion

let gameGrid = new PIXI.Container();

class Cell extends PIXI.Graphics {
    constructor(x = 0, y = 0, fillColor = '#F08080', borderColor = '#F4478E', size = CELLSIZE) {
        super();

        this.x = x;
        this.y = y;
        this.beginFill(fillColor);
        this.lineStyle(4, borderColor, 1);
        this.drawRect(x, y, size, size);
        this.endFill();
    }
}

class Block extends PIXI.Graphics {
    constructor(x = 0, y = 0, shape, numPossForms = 1, currentForm = 1) {
        super();

        this.x = x;
        this.y = y;

        this.shape = shape;

        this.numPossForms = numPossForms; // # of possible forms through 90deg rotations

        this.currentForm = currentForm; // the current shape after being rotated 90Deg currentForm-1 times
        if (this.currentForm < 1) this.currentForm = 1;

        this.dragging = false;

        this.eventmode = 'static';
        this.eventmode = 'static';
        this.enableDragging();
    }

    onDragStart(e) {
        this.data = e.data;
        this.dragging = true;
        this.alpha = 0.5;

        this.x = e.data.global.x;
        this.y = e.data.global.y;
    }

    onDragEnd(e) {
        this.x = e.data.global.x;
        this.y = e.data.global.y;
        this.dragging = false;
        this.alpha = 1;
        this.data = null;
    }

    onDragMove(e) {
        if (this.dragging) {
            this.x = e.data.global.x;
            this.y = e.data.global.y;
        }
    }

    enableDragging() {
        this.interactive = true;
        this.on('pointerdown', this.onDragStart)
            .on('pointerup', this.onDragEnd)
            .on('pointerupoutside', this.onDragEnd)
            .on('pointermove', this.onDragMove);
    }

    disableDragging() {
        this.interactive = true;
        this.off('pointerdown', this.onDragStart)
            .off('pointerup', this.onDragEnd)
            .off('pointerupoutside', this.onDragEnd)
            .off('pointermove', this.onDragMove);
    }

    drawBlock() {
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j] != 0) {
                    let cell = new Cell(i * CELLSIZE / 2, j * CELLSIZE / 2, '#F694C1', '#E4C1F9');
                    this.addChild(cell);
                }
            }
        }
        app.stage.addChild(this);
    }
}





let testCell = new Cell(36, 174, '#B0DB43', '#12EAEA', 74);
app.stage.addChild(testCell);

let testBlock = new Block(60, 50, blockShapes[14], 4);
testBlock.drawBlock();
console.log(testBlock);
console.log(testBlock.shape);
console.log(rotateBlock(testBlock, 1));

let testerBlock = new Block(80, 90, testBlock.shape, 4);
testerBlock.x = 160;
testerBlock.y = 280;
testerBlock.drawBlock();