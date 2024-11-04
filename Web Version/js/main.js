"use strict";
const app = new PIXI.Application({ 'width': 800, 'height': 900, 'backgroundColor': '#FCFCF4' });
document.body.querySelector("#pixicanvas").appendChild(app.view);

window.__PIXI_DEVTOOLS__ = { app: app };

const WIDTH = app.view.width;
const HEIGHT = app.view.height;

//#region
let score = 0;
// let startScene, gameScene, gameOverScene;
// let startGameButton, startOverButton;
// let gameOverText;

// function setup(){
//     let startScene=new PIXI.Container();
//     let gameScene=new PIXI.Container();
//     let gameOverScene=new PIXI.Container();

//     app.stage.addChild(startScene);
//     app.stage.addChild(gameScene);
//     app.stage.addChild(gameOverScene);

//     startScene.visible=true;
//     gameScene.visible=false;
//     gameOverScene.visible=false;
// }
//#endregion

//#region game grid
let gameGrid = {
    size: CELLSIZE * 9,
    gridContainer: new PIXI.Container(),
    gridGraphic: new PIXI.Graphics,
    gridArray: Array(9).fill().map(() => Array(9).fill(0)),
    cellArray: [[], [], [], [], [], [], [], [], []],
    topLeftCorner: { x: 75, y: 100 },
};
app.stage.addChild(gameGrid.gridContainer);

// drawcells
for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        let currentColor = Math.floor(i / 3) % 2 === Math.floor(j / 3) % 2 ? '#D0EFB1' : '#B3D89C';

        let cell = new PIXI.Graphics();
        cell.beginFill(currentColor);
        cell.drawRect(gameGrid.topLeftCorner.x + (CELLSIZE * j), gameGrid.topLeftCorner.y + (CELLSIZE * i), CELLSIZE, CELLSIZE);
        cell.endFill();

        gameGrid.cellArray[j][i] = cell;
        gameGrid.gridContainer.addChild(cell);
    }
}
gameGrid.gridContainer.addChild(gameGrid.gridGraphic);

//draw lines
let lines = new PIXI.Graphics();
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
app.stage.addChild(lines);

gameGrid.gridContainer.eventMode = 'static';
//#endregion

//#region movement
let dragTarget = null;
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

function onDragStart() {
    dragTarget = this;

    dragTarget.alpha = 0.6;
    dragTarget.changeForms(false);
    app.stage.on('pointermove', onDragMove);
}

function onDragMove(e) {
    if (dragTarget) {
        dragTarget.parent.toLocal(e.global, null, dragTarget.position);

        if (isInGrid(dragTarget)) {
            getNearestSpot(dragTarget);
        }
        else {
        }
    }
}

function onDragEnd() {
    if (dragTarget) {
        app.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        dragTarget.changeForms();

        dragTarget = null;
    }
}

function isInGrid(block) {
    let ab = block.getBounds();
    let bb = gameGrid.gridContainer.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function getNearestSpot(block) {
    // Get the top-left corner of the block
    let topCorner = { x: 0, y: 0 };
    topCorner.x = Math.floor(block.getBounds().x);
    topCorner.y = Math.floor(block.getBounds().y);

    console.log(topCorner);

    // Calculate the nearest grid cell
    let nearestGridCell = { x: 0, y: 0 };
    nearestGridCell.x = Math.floor(topCorner.x / CELLSIZE);
    nearestGridCell.y = Math.floor(topCorner.y / CELLSIZE)-1;

    console.log(nearestGridCell);

    let hoveredGridCells = Array(block.shape.length).fill().map(() => Array(block.shape[0].length).fill([-1, -1]));

    //isPlaceable(block, nearestGridCell.x, nearestGridCell.y);
}

function isPlaceable(block, gridRow, gridCol) {
    console.log('===');
    for (let i = 0; i < block.shape.length; i++) {
        for (let j = 0; j < block.shape[0].length; j++) {
            if (block.shape[i][j] == 1) {
                let boardPlace = {
                    x: gridRow + i,
                    y: gridCol + j
                };

                console.log(boardPlace);
            }
        }
    }

    return true;
}

function snapBlockToGrid(block) {


    this.block.changeForms();
    this.block.alpha = 1;
    this.block.disableInteractivity();
}
//#endregion

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
        app.stage.addChild(newBlock);
        playableBlocks.push(newBlock);
    }
}

generatePlayableBlocks();
//#endregion

//#region Test Buttons
const button1 = new PIXI.Graphics();
button1.beginFill('#EF3E36');
button1.drawRect(100, 25, 100, 45);
button1.eventMode = 'static';
button1.cursor = 'pointer';
button1.on('pointerdown', onbutton1Down)
    .on('pointerup', onbutton1Up)
    .on('pointerupoutside', onbutton1Up)
    .on('pointerover', onbutton1Over)
    .on('pointerout', onbutton1Out);
app.stage.addChild(button1);

const button1Text = new PIXI.Text("Rotate", new PIXI.TextStyle({ fontFamily: 'Arial', fontSize: 24 }));
button1Text.x = 110;
button1Text.y = 35;
button1.addChild(button1Text);

function onbutton1Down(e) {
    console.log("Button 1 says: MEOW");
    playableBlocks.forEach(block => {
        block.rotateBlock();
        console.log(block.shape);
    });
};
function onbutton1Up(e) {

};
function onbutton1Over(e) {

};
function onbutton1Out(e) {

};

const button2 = new PIXI.Graphics();
button2.beginFill('#EF3E36');
button2.drawRect(250, 25, 100, 45);
button2.eventMode = 'static';
button2.cursor = 'pointer';
button2.on('pointerdown', onbutton2Down)
    .on('pointerup', onbutton2Up)
    .on('pointerupoutside', onbutton2Up)
    .on('pointerover', onbutton2Over)
    .on('pointerout', onbutton2Out);
app.stage.addChild(button2);

const button2Text = new PIXI.Text("BUTTOM", new PIXI.TextStyle({ fontFamily: 'Arial', fontSize: 20 }));
button2Text.x = 260;
button2Text.y = 35;
button2.addChild(button2Text);

function onbutton2Down(e) {
    console.log("Button 2 says: uwu");
};
function onbutton2Up(e) {

};
function onbutton2Over(e) {

};
function onbutton2Out(e) {

};

const button3 = new PIXI.Graphics();
button3.beginFill('#EF3E36');
button3.drawRect(400, 25, 100, 45);
button3.eventMode = 'static';
button3.cursor = 'pointer';
button3.on('pointerdown', onbutton3Down)
    .on('pointerup', onbutton3Up)
    .on('pointerupoutside', onbutton3Up)
    .on('pointerover', onbutton3Over)
    .on('pointerout', onbutton3Out);
app.stage.addChild(button3);

const button3Text = new PIXI.Text("New Blocks", new PIXI.TextStyle({ fontFamily: 'Arial', fontSize: 16 }));
button3Text.x = 410;
button3Text.y = 35;
button3.addChild(button3Text);

function onbutton3Down(e) {
    console.log("Button 3 says: Hewwo");
    generatePlayableBlocks();
};
function onbutton3Up(e) {

};
function onbutton3Over(e) {

};
function onbutton3Out(e) {

};
//#endregion