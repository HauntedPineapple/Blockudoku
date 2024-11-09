"use strict";
const APP = new PIXI.Application({ 'width': 600, 'height': 750, 'backgroundColor': '#FCFCF4' });
document.body.querySelector("#pixicanvas").appendChild(APP.view);

window.__PIXI_DEVTOOLS__ = { app: APP };

const WIDTH = APP.view.width;
const HEIGHT = APP.view.height;

//#region
// let score = 0;
// let startScene, gameScene, gameOverScene;
// let startGameButton, startOverButton;
// let gameOverText;

// function setup(){
//     let startScene=new PIXI.Container();
//     let gameScene=new PIXI.Container();
//     let gameOverScene=new PIXI.Container();

//     APP.stage.addChild(startScene);
//     APP.stage.addChild(gameScene);
//     APP.stage.addChild(gameOverScene);

//     startScene.visible=true;
//     startScene.label='start scene';
//     gameScene.visible=false;
//     gameScene.label='game scene';
//     gameOverScene.visible=false;
//     gameOverScene.label='game over scene';
// }
//#endregion

//#region game grid
let gameGrid = {
    size: CELLSIZE * 9,
    gridContainer: new PIXI.Container(),
    cellArray: [[], [], [], [], [], [], [], [], []],
    topLeftCorner: { x: 75, y: 100 },
};
gameGrid.gridContainer.label = 'grid container';

// drawcells
for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        let currentColor = Math.floor(i / 3) % 2 === Math.floor(j / 3) % 2 ? '#D0EFB1' : '#B3D89C';

        let cell = new PIXI.Graphics();
        cell.beginFill(currentColor);
        cell.drawRect(gameGrid.topLeftCorner.x + (CELLSIZE * j), gameGrid.topLeftCorner.y + (CELLSIZE * i), CELLSIZE, CELLSIZE);
        cell.endFill();
        cell.label = 'grid cell';

        gameGrid.cellArray[j][i] = cell;
        gameGrid.gridContainer.addChild(cell);
    }
}
APP.stage.addChild(gameGrid.gridContainer);

//draw lines
let lines = new PIXI.Graphics();
lines.label = 'grid lines';
lines.lineStyle(10, '#000000', 1);
lines.moveTo(gameGrid.topLeftCorner.x, gameGrid.topLeftCorner.y - 5);
lines.lineTo(gameGrid.topLeftCorner.x + gameGrid.size, gameGrid.topLeftCorner.y - 5);
lines.moveTo(gameGrid.topLeftCorner.x, gameGrid.topLeftCorner.y + gameGrid.size + 5);
lines.lineTo(gameGrid.topLeftCorner.x + gameGrid.size, gameGrid.topLeftCorner.y + gameGrid.size + 5);
lines.moveTo(gameGrid.topLeftCorner.x - 5, gameGrid.topLeftCorner.y - 10);
lines.lineTo(gameGrid.topLeftCorner.x - 5, gameGrid.topLeftCorner.y + gameGrid.size + 10);
lines.moveTo(gameGrid.topLeftCorner.x + gameGrid.size + 5, gameGrid.topLeftCorner.y - 10);
lines.lineTo(gameGrid.topLeftCorner.x + gameGrid.size + 5, gameGrid.topLeftCorner.y + gameGrid.size + 10);
lines.lineStyle(1, '#000000', 1);
for (let i = 1; i < 9; i++) {
    lines.moveTo(gameGrid.topLeftCorner.x, gameGrid.topLeftCorner.y + CELLSIZE * i);
    lines.lineTo(gameGrid.topLeftCorner.x + gameGrid.size, gameGrid.topLeftCorner.y + CELLSIZE * i);
    for (let j = 1; j < 9; j++) {
        lines.moveTo(gameGrid.topLeftCorner.x + CELLSIZE * j, gameGrid.topLeftCorner.y);
        lines.lineTo(gameGrid.topLeftCorner.x + CELLSIZE * j, gameGrid.topLeftCorner.y + gameGrid.size);
    }
}
APP.stage.addChild(lines);
//#endregion game grid

//#region movement
let dragTarget = null;
let hoveredGridCells = null;
APP.stage.eventMode = 'static';
APP.stage.hitArea = APP.screen;
APP.stage.on('pointerup', onDragEnd);
APP.stage.on('pointerupoutside', onDragEnd);

function onDragStart() {
    dragTarget = this;

    dragTarget.alpha = 0.6;
    dragTarget.changeForms(false);
    APP.stage.on('pointermove', onDragMove);
}

function onDragMove(e) {
    if (dragTarget) {
        dragTarget.parent.toLocal(e.global, null, dragTarget.position);

        // showBlockData();
        if (isInGrid(dragTarget)) {
            getNearestSpot(dragTarget);


        }
        else if (hoveredGridCells && hoveredGridCells.length > 0) {
            hoveredGridCells.forEach(row => {
                row.forEach(cell => {
                    if (cell)
                        cell.tint = 0xFFFFFF;
                });
            });
        }

    }
}

function onDragEnd() {
    if (dragTarget) {
        APP.stage.off('pointermove', onDragMove);
        if (hoveredGridCells && hoveredGridCells.length > 0) {
            hoveredGridCells.forEach(row => {
                row.forEach(cell => {
                    if (cell)
                        cell.tint = 0xFFFFFF;
                });
            });
        }

        dragTarget.alpha = 1;
        dragTarget.changeForms();

        dragTarget = null;
    }
}

function isInGrid(block) {
    let ab = block.getBounds();
    let bb = gameGrid.gridContainer.getBounds();

    let topLeftCorner = { x: ab.x, y: ab.y };
    let bottomRightCorner = { x: ab.x + ab.width, y: ab.y + ab.height };

    if (topLeftCorner.x >= bb.x &&
        topLeftCorner.x <= bb.x + bb.width &&
        topLeftCorner.y >= bb.y &&
        topLeftCorner.y <= bb.y + bb.height &&
        bottomRightCorner.x >= bb.x &&
        bottomRightCorner.x <= bb.x + bb.width &&
        bottomRightCorner.y >= bb.y &&
        bottomRightCorner.y <= bb.y + bb.height) {
        return true;
    }

    return false;
}

function getNearestSpot(block) {
    // Get the top-left corner of the block
    let topCorner = { x: Math.floor(block.getBounds().x), y: Math.floor(block.getBounds().y) };

    // Calculate the nearest grid cell
    let nearestGridCell = { x: Math.floor(topCorner.x / CELLSIZE), y: Math.floor(topCorner.y / CELLSIZE) - 1 };

    // console.log(block.shape);
    // console.log(nearestGridCell);
    isPlaceable(block, nearestGridCell.x, nearestGridCell.y);
}

function isPlaceable(block, gridRow, gridCol) {
    if (hoveredGridCells && hoveredGridCells.length > 0) {
        hoveredGridCells.forEach(row => {
            row.forEach(cell => {
                if (cell)
                    cell.tint = 0xFFFFFF;
            });
        });
    }

    hoveredGridCells = Array(block.shape.length).fill().map(() => Array(block.shape[0].length).fill());

    for (let i = 0; i < block.shape[0].length; i++) {
        for (let j = 0; j < block.shape.length; j++) {
            if (block.shape[j][i] == 1) {
                let boardIndices = {
                    row: gridRow + i - 1,
                    col: gridCol + j - 1
                };

                // get the index of the corresponding cell
                let index = (9 * boardIndices.col) + boardIndices.row;

                if (gameGrid.gridContainer.children.length > index > 0) {
                    let cell = gameGrid.gridContainer.children[index];
                    hoveredGridCells[j][i] = cell;
                    cell.tint = 0x22aa00;
                }
                else return false;
            }
        }
    }
    return true;
}

function snapBlockToGrid(block) {
    this.block.alpha = 1;
    this.block.disableInteractivity();
}
//#endregion movement

//#region playable blocks
const playableBlockPositions = {
    x1: gameGrid.topLeftCorner.x + CELLSIZE - 10,
    x2: gameGrid.topLeftCorner.x + CELLSIZE * 4.5,
    x3: gameGrid.topLeftCorner.x + CELLSIZE * 8 + 10,
    y: gameGrid.topLeftCorner.y + gameGrid.size + CELLSIZE * 2
}

let playableBlocks = [];

function generatePlayableBlocks() {
    for (let i = 0; i < 3; i++) {
        let removed = playableBlocks.pop();
        if (removed)
            removed.destroy();
    }

    for (let i = 0; i < 3; i++) {
        let randomNum = getRandomInt(0, Object.keys(BLOCKSHAPES).length);
        let randomBlockKey = Object.keys(BLOCKSHAPES)[randomNum];
        let positionKey = Object.keys(playableBlockPositions)[i];

        let newBlock = new Block(playableBlockPositions[positionKey], playableBlockPositions.y, BLOCKSHAPES[randomBlockKey], onDragStart);
        newBlock.label = `Playable Block ${i + 1}`;
        APP.stage.addChild(newBlock);
        playableBlocks.push(newBlock);
    }
}

generatePlayableBlocks();
//#endregion playable blocks

//#region Testing and Debugging
function showBlockData() {
    document.body.querySelector("#output").innerHTML = '';
    //displayData(gameGrid.gridContainer, gameGrid.gridContainer.label);
    playableBlocks.forEach(child => {
        displayData(child, child.label);
        displayData(child.children[0], child.children[0].label)
        displayData(child.children[1], child.children[1].label)
    });
}
showBlockData();

//#region HTML Buttons
const ButtonA = document.body.querySelector("#aButton");
const ButtonB = document.body.querySelector("#bButton");
const ButtonC = document.body.querySelector("#cButton");
const ButtonX = document.body.querySelector("#xButton");
const ButtonY = document.body.querySelector("#yButton");
const ButtonZ = document.body.querySelector("#zButton");

ButtonA.innerHTML = "Show Block Data";
ButtonA.addEventListener('click', (e) => {
    // console.log('Button A says: owo');
    showBlockData();
});

ButtonB.innerHTML = "Generate New Blocks";
ButtonB.addEventListener('click', (e) => {
    // console.log('Button B says: XD');
    generatePlayableBlocks();
});

ButtonC.innerHTML = "Clear Output Data";
ButtonC.addEventListener('click', (e) => {
    // console.log('Button C says: rawr');
    document.body.querySelector("#output").innerHTML = '';
});

ButtonX.innerHTML = "ButtonX";
ButtonX.addEventListener('click', (e) => {
    console.log('Button X says: UWU');

});

ButtonY.innerHTML = "ButtonY";
ButtonY.addEventListener('click', (e) => {
    console.log('Button Y says: meow');

});

ButtonZ.innerHTML = "ButtonZ";
ButtonZ.addEventListener('click', (e) => {
    console.log('Button Z says: Hewwo');

});
//#endregion HTML Buttons

//#region Key Presses
document.addEventListener('keydown', (e) => {
    console.log(`\"${e.key}" key pressed`);
    if (e.key === ' ') {

    }
});
//#endregion Key Presses

//#endregion Testing and Debugging
