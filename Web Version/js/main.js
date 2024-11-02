"use strict";
const app = new PIXI.Application({ 'height': 800, 'width': 600, 'backgroundColor': '#FCFCF4' });
document.body.querySelector("#pixicanvas").appendChild(app.view);

//#region Constants
const WIDTH = app.view.width;
const HEIGHT = app.view.height;
const CELLSIZE = 50; //px

const blockShapes = {
    'CELL': [//numForms: 1
        [1]
    ],
    'block1': [//numForms: 2
        [1],
        [1]
    ],
    'block2': [//numForms: 2
        [1],
        [1],
        [1]
    ],
    'block3': [//numForms: 2
        [1],
        [1],
        [1],
        [1]
    ],
    'block4': [//numForms: 2
        [1],
        [1],
        [1],
        [1],
        [1]
    ],
    'block5': [//numForms: 2
        [0, 1],
        [1, 0]
    ],
    'block6': [//numForms: 2
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0]
    ],
    'block7': [//numForms: 4
        [1, 0],
        [1, 1]
    ],
    'block8': [//numForms: 4
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0]
    ],
    'block9': [//numForms: 4
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    'block10': [//numForms: 4
        [0, 1, 0],
        [1, 1, 1]
    ],
    'block11': [//numForms: 4
        [1, 1],
        [1, 0],
        [1, 1]
    ],
    'block12': [//numForms: 4
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    'block13': [//numForms: 4
        [0, 1],
        [0, 1],
        [1, 1]
    ],
    'block14': [//numForms: 4
        [1, 1, 0],
        [0, 1, 1]
    ],
    'block15': [//numForms: 4
        [0, 1, 1],
        [1, 1, 0]
    ],
    'block16': [//numForms: 1
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    'block17': [//numForms: 1
        [1, 1],
        [1, 1]
    ]
};
//#endregion

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
        // console.log('dragTarget: ');
        // console.log(dragTarget);
        // console.log('dragTarget.parent: ');
        // console.log(dragTarget.parent);
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

    const playableBlockPositions = {
        x1: gameGrid.topLeftCorner.x + CELLSIZE - 10,
        x2: gameGrid.topLeftCorner.x + CELLSIZE * 4.5,
        x3: gameGrid.topLeftCorner.x + CELLSIZE * 8 + 10,
        y: gameGrid.topLeftCorner.y + gameGrid.size + CELLSIZE * 2.5
    }
    let testSprite1 = new BlockSprite(playableBlockPositions.x1, playableBlockPositions.y, blockShapes.block7, textures.block7, onDragStart);
    let testSprite2 = new BlockSprite(playableBlockPositions.x2, playableBlockPositions.y, blockShapes.block16, textures.block16, onDragStart);
    let testSprite3 = new BlockSprite(playableBlockPositions.x3, playableBlockPositions.y, blockShapes.block2, textures.block2, onDragStart);
});