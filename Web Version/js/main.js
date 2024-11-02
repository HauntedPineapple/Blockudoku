"use strict";
const app = new PIXI.Application({ 'width': 600, 'height': 900, 'backgroundColor': '#FCFCF4' });
document.body.querySelector("#pixicanvas").appendChild(app.view);

const WIDTH = app.view.width;
const HEIGHT = app.view.height;
const CELLSIZE = 50; //px

const BLOCKSHAPES = {
    'CELL': {
        shape: [
            [1]
        ], numForms: 1
    },
    'block1': {
        shape: [
            [1],
            [1]
        ], numForms: 2
    },
    'block2': {
        shape: [
            [1],
            [1],
            [1]
        ],
        numForms: 2
    },
    'block3': {
        shape: [
            [1],
            [1],
            [1],
            [1]
        ], numForms: 2
    },
    'block4': {
        shape: [
            [1],
            [1],
            [1],
            [1],
            [1]
        ], numForms: 2
    },
    'block5': {
        shape: [
            [0, 1],
            [1, 0]
        ], numForms: 2
    },
    'block6': {
        shape: [
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0]
        ], numForms: 2
    },
    'block7': {
        shape: [
            [1, 0],
            [1, 1]
        ], numForms: 4
    },
    'block8': {
        shape: [
            [1, 1, 1],
            [1, 0, 0],
            [1, 0, 0]
        ], numForms: 4
    },
    'block9': {
        shape: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 1, 0]
        ], numForms: 4
    },
    'block10': {
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ], numForms: 4
    },
    'block11': {
        shape: [
            [1, 1],
            [1, 0],
            [1, 1]
        ], numForms: 4
    },
    'block12': {
        shape: [
            [1, 0],
            [1, 0],
            [1, 1]
        ], numForms: 4
    },
    'block13': {
        shape: [
            [0, 1],
            [0, 1],
            [1, 1]
        ], numForms: 4
    },
    'block14': {
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ], numForms: 4
    },
    'block15': {
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ], numForms: 4
    },
    'block16': {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]
        ], numForms: 1
    },
    'block17': {
        shape: [
            [1, 1],
            [1, 1]
        ], numForms: 1
    },
};
const SHAPEKEYS = Object.keys(BLOCKSHAPES);

for (let i = 0; i < SHAPEKEYS.length; i++) {
    //console.log(SHAPEKEYS[i]);
    PIXI.Assets.add({
        alias: SHAPEKEYS[i],
        src: './assets/' + SHAPEKEYS[i] + '.png'
    });
}

let score = 0;
// let startScene, gameScene, gameOverScene;
// let startGameButton, startOverButton;
// let gameOverText;
let blocksOnGrid = [];
let playableBlocks = [];

let texturesPromise = PIXI.Assets.load(SHAPEKEYS);
texturesPromise.then((textures) => {
    //#region  Create game grid
    let gameGrid = {
        size: CELLSIZE * 9,
        gridGraphic: new PIXI.Graphics,
        gridArray: Array(9).fill().map(() => Array(9).fill(0)),
        topLeftCorner: { x: 75, y: 100 },
    };

    gameGrid.gridGraphic.beginFill('#FFF9F9');
    gameGrid.gridGraphic.drawRect(gameGrid.topLeftCorner.x, gameGrid.topLeftCorner.y, gameGrid.size, gameGrid.size);
    //draw squares
    let numDrawn = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (numDrawn % 2 == 0) gameGrid.gridGraphic.beginFill('#D0EFB1');
            else gameGrid.gridGraphic.beginFill('#B3D89C');
            gameGrid.gridGraphic.drawRect(gameGrid.topLeftCorner.x + gameGrid.size / 3 * j, gameGrid.topLeftCorner.y + gameGrid.size / 3 * i, gameGrid.size / 3, gameGrid.size / 3);
            numDrawn++;
        }
    }

    //draw lines
    gameGrid.gridGraphic.lineStyle(10, '#000000', 1);
    gameGrid.gridGraphic.moveTo(gameGrid.topLeftCorner.x, gameGrid.topLeftCorner.y - 5);
    gameGrid.gridGraphic.lineTo(gameGrid.topLeftCorner.x + gameGrid.size, gameGrid.topLeftCorner.y - 5);
    gameGrid.gridGraphic.moveTo(gameGrid.topLeftCorner.x, gameGrid.topLeftCorner.y + gameGrid.size + 5);
    gameGrid.gridGraphic.lineTo(gameGrid.topLeftCorner.x + gameGrid.size, gameGrid.topLeftCorner.y + gameGrid.size + 5);
    gameGrid.gridGraphic.moveTo(gameGrid.topLeftCorner.x - 5, gameGrid.topLeftCorner.y - 10);
    gameGrid.gridGraphic.lineTo(gameGrid.topLeftCorner.x - 5, gameGrid.topLeftCorner.y + gameGrid.size + 10);
    gameGrid.gridGraphic.moveTo(gameGrid.topLeftCorner.x + gameGrid.size + 5, gameGrid.topLeftCorner.y - 10);
    gameGrid.gridGraphic.lineTo(gameGrid.topLeftCorner.x + gameGrid.size + 5, gameGrid.topLeftCorner.y + gameGrid.size + 10);

    gameGrid.gridGraphic.lineStyle(1, '#000000', 1);
    for (let i = 1; i < 9; i++) {
        gameGrid.gridGraphic.moveTo(gameGrid.topLeftCorner.x, gameGrid.topLeftCorner.y + CELLSIZE * i);
        gameGrid.gridGraphic.lineTo(gameGrid.topLeftCorner.x + gameGrid.size, gameGrid.topLeftCorner.y + CELLSIZE * i);
        for (let j = 1; j < 9; j++) {
            gameGrid.gridGraphic.moveTo(gameGrid.topLeftCorner.x + CELLSIZE * j, gameGrid.topLeftCorner.y);
            gameGrid.gridGraphic.lineTo(gameGrid.topLeftCorner.x + CELLSIZE * j, gameGrid.topLeftCorner.y + gameGrid.size);
        }
    }

    app.stage.addChild(gameGrid.gridGraphic);

    const playableBlockPositions = {
        x1: gameGrid.topLeftCorner.x + CELLSIZE - 10,
        x2: gameGrid.topLeftCorner.x + CELLSIZE * 4.5,
        x3: gameGrid.topLeftCorner.x + CELLSIZE * 8 + 10,
        y: gameGrid.topLeftCorner.y + gameGrid.size + CELLSIZE * 2
    }
    //#endregion

    //#region Move blocks
    let dragTarget = null;
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);

    function onDragStart() {
        this.alpha = 0.5;
        dragTarget = this.sprite;
        dragTarget.scale = new PIXI.Point(0.5, 0.5);
        app.stage.on('pointermove', onDragMove);
    }

    function onDragMove(e) {
        if (dragTarget) {
            dragTarget.parent.toLocal(e.global, null, dragTarget.position);
        }
    }

    function onDragEnd() {
        if (dragTarget) {
            app.stage.off('pointermove', onDragMove);
            dragTarget.alpha = 1;

            dragTarget.scale = new PIXI.Point(0.35, 0.35);

            dragTarget = null;
        }
    }

    function getNearestSpot(blockSprite){
        
    }

    function snapBlockToGrid(blockSprite) {
        // Calculate the nearest grid cell based on the block’s current position.
        // Check if the target position on the board is unoccupied and within bounds.

        this.blockSprite.disableInteractivity();
    }
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
        playableBlocks[0].rotate();
        playableBlocks[1].rotate();
        playableBlocks[2].rotate();
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

        for (let i = 0; i < 3; i++) {
            let removed = playableBlocks.pop();
            removed.release();
        }

        for (let i = 0; i < 3; i++) {
            let randomNum = getRandomInt(0, SHAPEKEYS.length);
            let positionKey = Object.keys(playableBlockPositions)[i];
            let newBlock = new BlockSprite(playableBlockPositions[positionKey], playableBlockPositions.y, BLOCKSHAPES[SHAPEKEYS[randomNum]].shape, textures[SHAPEKEYS[randomNum]], onDragStart)
            playableBlocks.push(newBlock);
        }
    };
    function onbutton3Up(e) {

    };
    function onbutton3Over(e) {

    };
    function onbutton3Out(e) {

    };
    //#endregion

    //#region TESTING

    for (let i = 0; i < 3; i++) {
        let randomNum = getRandomInt(0, SHAPEKEYS.length);
        let positionKey = Object.keys(playableBlockPositions)[i];
        let newBlock = new BlockSprite(playableBlockPositions[positionKey], playableBlockPositions.y, BLOCKSHAPES[SHAPEKEYS[randomNum]].shape, textures[SHAPEKEYS[randomNum]], onDragStart)
        playableBlocks.push(newBlock);
    }

    // let testSprite1 = new BlockSprite(playableBlockPositions.x1, playableBlockPositions.y, BLOCKSHAPES.block7.shape, textures.block7, onDragStart);
    // let testSprite2 = new BlockSprite(playableBlockPositions.x2, playableBlockPositions.y, BLOCKSHAPES.block16.shape, textures.block16, onDragStart);
    // let testSprite3 = new BlockSprite(playableBlockPositions.x3, playableBlockPositions.y, BLOCKSHAPES.block2.shape, textures.block2, onDragStart);
    //#endregion
});

