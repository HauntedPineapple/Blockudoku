"use strict";
const app = new PIXI.Application({ 'height': 600, 'width': 600, 'backgroundColor': '#FCFCF4' });
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
    const gameGrid = new PIXI.Graphics();
    gameGrid.beginFill('#F7F9F7');
    gameGrid.drawRect(75, 75, 50, 50);
    app.stage.addChild(gameGrid);
    //#endregion

    let testSprite = new BlockSprite(app.screen.width / 2, app.screen.height / 2, blockShapes.block13, textures.block13, onDragStart)

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
});