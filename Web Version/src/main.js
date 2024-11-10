"use strict";
const APP = new PIXI.Application({ 'width': 600, 'height': 750, 'backgroundColor': '#FCFCF4' });
document.body.querySelector("#pixicanvas").appendChild(APP.view);

window.__PIXI_DEVTOOLS__ = { app: APP };

const WIDTH = APP.view.width;
const HEIGHT = APP.view.height;

//#region UI
let score = 0;
let scoreText = new PIXI.Text('Score: 0', new PIXI.TextStyle({
    fontSize: 30,
    dropShadow: true,
    dropShadowAlpha: 0.5,
    dropShadowAngle: 0.5,
    dropShadowBlur: 1,
    dropShadowColor: "#a5eee2",
    dropShadowDistance: 3,
    fontFamily: "Impact"
}));
scoreText.anchor.set(0.5);
scoreText.position = new PIXI.Point(WIDTH / 2, HEIGHT / 15);
APP.stage.addChild(scoreText);

let scoreUpdater = new PIXI.Text('', new PIXI.TextStyle({
    fontFamily: "Tahoma",
    fontSize: 16
}));
scoreUpdater.anchor.set(0.5);
scoreUpdater.position = new PIXI.Point(WIDTH / 2, HEIGHT / 36);
APP.stage.addChild(scoreUpdater);

function updateScore(addAmount = 0) {
    score += addAmount;
    scoreText.text = `Score: ${score}`;

    // scoreUpdater.text = "3x Streak, +32";
    // window.setTimeout((e) => {
    //     scoreUpdater.text = "";
    // }, 1500);
}

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
//#endregion UI

//#region game grid
let gameGrid = {
    size: CELLSIZE * 9,
    gridContainer: new PIXI.Container(),
    gridCellArray: [[], [], [], [], [], [], [], [], []],
    gridArray: Array(9).fill().map(() => Array(9).fill(0)),
    topLeftCorner: { x: 75, y: 80 },
};
gameGrid.gridContainer.label = 'grid container';

//#region draw cells
for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        let currentColor = Math.floor(i / 3) % 2 === Math.floor(j / 3) % 2 ? GRIDCOLOR1 : GRIDCOLOR2;

        let cell = new PIXI.Graphics();
        cell.beginFill(currentColor);
        cell.x = gameGrid.topLeftCorner.x + (CELLSIZE * j);
        cell.y = gameGrid.topLeftCorner.y + (CELLSIZE * i);
        cell.drawRect(0, 0, CELLSIZE, CELLSIZE);
        cell.endFill();
        cell.label = 'grid cell';

        gameGrid.gridCellArray[j][i] = cell;
        gameGrid.gridContainer.addChild(cell);
    }
}
APP.stage.addChild(gameGrid.gridContainer);
//#endregion draw cells

//#region draw lines
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
//#endregion draw lines
//#endregion game grid

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

//generatePlayableBlocks();
for (let i = 0; i < 3; i++) {
    let positionKey = Object.keys(playableBlockPositions)[i];

    let newBlock = new Block(playableBlockPositions[positionKey], playableBlockPositions.y, BLOCKSHAPES.block8, onDragStart);
    newBlock.label = `Playable Block ${i + 1}`;
    APP.stage.addChild(newBlock);
    playableBlocks.push(newBlock);
}

//#endregion playable blocks

//#region movement
let dragTarget = null;
let hoveredGridCells = null;
let nearestSpot = null; // obj = {x:#, y:#}

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

        if (isInGrid(dragTarget)) {
            clearHoveredCells();
            getNearestSpot(dragTarget);
        }
        else {
            clearHoveredCells();
        }
    }
}

function onDragEnd() {
    if (dragTarget) {
        APP.stage.off('pointermove', onDragMove);

        if (isPlaceable(dragTarget, nearestSpot)) { // place the block
            snapBlockToGrid(dragTarget, nearestSpot);
        }
        else { // find the block's original spot & put it back
            switch (Number(dragTarget.label.split("Playable Block ")[1])) {
                case 1:
                    dragTarget.position.x = playableBlockPositions.x1;
                    break;
                case 2:
                    dragTarget.position.x = playableBlockPositions.x2;
                    break;
                case 3:
                    dragTarget.position.x = playableBlockPositions.x3;
                    break;
            }
            dragTarget.position.y = playableBlockPositions.y;
        }

        clearHoveredCells();
        dragTarget.alpha = 1;
        dragTarget.changeForms();

        nearestSpot = null;
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

/**
 * Gets the nearest grid cell to the top left corner of the block's hitbox
 * @param {Block} block 
 * @returns the indices of the nearest grid cell
 */
function getNearestSpot(block) {
    // Get the top-left corner of the block
    let topCorner = { x: Math.floor(block.getBounds().x), y: Math.floor(block.getBounds().y) };

    // Calculate the nearest grid cell
    let nearestGridCell = { x: Math.floor(topCorner.x / CELLSIZE), y: Math.floor(topCorner.y / CELLSIZE) };

    // console.log(block.shape);
    // console.log(nearestGridCell);
    if (isPlaceable(block, nearestGridCell)) {
        nearestSpot = nearestGridCell;
        return nearestGridCell;
    }
    else {
        nearestSpot = null;
        return false;
    }
}

function isPlaceable(block, gridSpot) {
    if (gridSpot == null) return false;

    for (let i = 0; i < block.shape[0].length; i++) {
        for (let j = 0; j < block.shape.length; j++) {
            if (block.shape[j][i] == 1) {
                let boardIndices = {
                    row: gridSpot.x + i - 1,
                    col: gridSpot.y + j - 1
                };

                // if the gridArray value is 0, it is an empty space
                if (gameGrid.gridArray[boardIndices.row][boardIndices.col] != 0) {
                    return false;
                }
            }
        }
    }
    tintHoveredCells(block, gridSpot);
    return true;
}

function snapBlockToGrid(block, gridSpot) {
    for (let i = 0; i < block.shape[0].length; i++) {
        for (let j = 0; j < block.shape.length; j++) {
            if (block.shape[j][i] == 1) //fill the spots
                gameGrid.gridArray[gridSpot.x + i - 1][gridSpot.y + j - 1] = 1;
        }
    }

    dragTarget.normalForm.scale = new PIXI.Point(1, 1);
    dragTarget.position.x = gameGrid.topLeftCorner.x + ((gridSpot.x - 1) * CELLSIZE) + dragTarget.pivot.x;
    dragTarget.position.y = gameGrid.topLeftCorner.y + ((gridSpot.y - 1) * CELLSIZE) + dragTarget.pivot.y;

    dragTarget.disableInteractivity();
}

function tintHoveredCells(block, gridSpot) {
    hoveredGridCells = Array(block.shape.length).fill().map(() => Array(block.shape[0].length).fill());
    for (let i = 0; i < block.shape[0].length; i++) {
        for (let j = 0; j < block.shape.length; j++) {
            if (block.shape[j][i] == 1) {
                let boardIndices = { row: gridSpot.x + i - 1, col: gridSpot.y + j - 1 };
                // get the index of the corresponding cell in the container's child array
                let index = (9 * boardIndices.col) + boardIndices.row;
                if (gameGrid.gridContainer.children.length > index > 0) {
                    let cell = gameGrid.gridContainer.children[index];
                    hoveredGridCells[j][i] = cell;
                    cell.tint = 0x22aa00;
                }
            }
        }
    }
}

function clearHoveredCells() {
    if (hoveredGridCells && hoveredGridCells.length > 0) {
        hoveredGridCells.forEach(row => {
            row.forEach(cell => {
                if (cell)
                    cell.tint = 0xFFFFFF;
            });
        });
    }
}
//#endregion movement

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
    showBlockData();
});

ButtonB.innerHTML = "Generate New Blocks";
ButtonB.addEventListener('click', (e) => {
    generatePlayableBlocks();
});

ButtonC.innerHTML = "Clear Output Data";
ButtonC.addEventListener('click', (e) => {
    document.body.querySelector("#output").innerHTML = '';
});

ButtonX.innerHTML = "ButtonX";
ButtonX.addEventListener('click', (e) => {
    console.log('Button X says: uwu');
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
    switch (e.key) {
        case '`':
            if (dragTarget) {
                console.log(`dragTarget.position`);
                console.log(dragTarget.position);
            }
            if (hoveredGridCells && hoveredGridCells.length > 0) {
                console.log(`hoveredGridCells`);
                console.log(hoveredGridCells);
                hoveredGridCells.forEach(row => {
                    row.forEach(cell => {
                        if (cell)
                            console.log('cell position');
                        console.log(cell.position);
                    });
                });
            }
            break;
        case '+':
            updateScore(1);
            break;
    }
});
//#endregion Key Presses

//#endregion Testing and Debugging