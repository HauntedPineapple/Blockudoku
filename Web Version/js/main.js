"use strict";
const app = new PIXI.Application({ 'width': 600, 'height': 800, 'backgroundColor': '#FCFCF4' });
document.body.querySelector("#pixicanvas").appendChild(app.view);

const WIDTH = app.view.width;
const HEIGHT = app.view.height;
const CELLSIZE = 50; //px

const blockShapes = {
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

let shapeKeys = Object.keys(blockShapes);
for (let i = 0; i < shapeKeys.length; i++) {
    //console.log(shapeKeys[i]);
    PIXI.Assets.add({
        alias: shapeKeys[i],
        src: './assets/' + shapeKeys[i] + '.png'
    });
}

let texturesPromise = PIXI.Assets.load(shapeKeys);
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
        y: gameGrid.topLeftCorner.y + gameGrid.size + CELLSIZE * 2.5
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
        dragTarget = this;
        app.stage.on('pointermove', onDragMove);
    }

    function onDragMove(e) {
        if (dragTarget) dragTarget.parent.toLocal(e.global, null, dragTarget.position);
    }

    function onDragEnd() {
        if (dragTarget) {
            app.stage.off('pointermove', onDragMove);
            dragTarget.alpha = 1;
            dragTarget = null;
        }
    }
    //#endregion

    //#region Test Button
    const button = new PIXI.Graphics();
    button.beginFill('#EF3E36');
    button.drawRect(250, 25, 100, 45);
    button.eventMode = 'static';
    button.cursor = 'pointer';
    button.on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);
    app.stage.addChild(button);

    function onButtonDown(e) {
        console.log("meow");
    };
    function onButtonUp(e) {

    };
    function onButtonOver(e) {

    };
    function onButtonOut(e) {

    };
    //#endregion

    //#region TESTING
    let blocksOnScreen = [];
    // for(let i=0;i<3;i++){
    //     blocksOnScreen.push(new BlockSprite(playableBlockPositions[i], playableBlockPositions.y, blockShapes[getRandom()], textures.block7, onDragStart));
    // }

    let testSprite1 = new BlockSprite(playableBlockPositions.x1, playableBlockPositions.y, blockShapes.block7.shape, textures.block7, onDragStart);
    let testSprite2 = new BlockSprite(playableBlockPositions.x2, playableBlockPositions.y, blockShapes.block16.shape, textures.block16, onDragStart);
    let testSprite3 = new BlockSprite(playableBlockPositions.x3, playableBlockPositions.y, blockShapes.block2.shape, textures.block2, onDragStart);
    //#endregion
});

