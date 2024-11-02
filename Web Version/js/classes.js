class BlockSprite extends PIXI.Graphics {
    constructor(x = 0, y = 0, shape, texture, dragFunc) {
        super();
        this.blockShape = shape;
        this.texture = texture;
        this.sprite = PIXI.Sprite.from(texture);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale = new PIXI.Point(0.5,0.5);
        
        this.sprite.anchor.set(0.5);

        this.dragFunc=dragFunc;
        this.enableInteractivity();
        app.stage.addChild(this.sprite);
    }

    enableInteractivity() {
        this.sprite.interactive = true;
        this.sprite.eventMode = 'static';
        this.sprite.on('pointerdown', this.dragFunc, this.sprite);
    }

    disableInteractivity() {
        this.sprite.interactive = false;
        this.sprite.off('pointerdown', this.dragFunc, this.sprite);
    }
}

// Stinky code below
// class Cell extends PIXI.Graphics {
//     constructor(x = 0, y = 0, fillColor = '#78CE8B', borderColor = '#12684E', size = CELLSIZE) {
//         super();

//         this.x = x;
//         this.y = y;
//         this.beginFill(fillColor);
//         this.lineStyle(4, borderColor, 1);
//         this.drawRect(x, y, size, size);
//         this.endFill();
//     }
// }

// class Block extends PIXI.Graphics {
//     constructor(x = 0, y = 0, shape, numPossForms = 1, currentForm = 1) {
//         super();

//         this.x = x;
//         this.y = y;
//         this.shape = shape;
//         this.numPossForms = numPossForms; // # of possible forms through 90deg rotations
//         this.currentForm = currentForm; // the current shape after being rotated 90Deg currentForm-1 times
//         if (this.currentForm < 1) this.currentForm = 1;

//         this.eventmode = 'static';
//         this.enableDragging();
//         this.isDragging = false;

//     }

//     onDragStart(e) {
//         // console.log("START");
//         console.log('this: ');
//         console.log(this);
//         console.log('this.parent: ');
//         console.log(this.parent);
//         this.isDragging = true;
//         this.alpha = 0.5;
//     }

//     onDragEnd(e) {
//         // console.log("END");
//         this.isDragging = false;
//         this.alpha = 1;
//     }

//     onDragMove(e) {
//         // console.log("MOVE");
//         if (this.isDragging) {
//             // console.log(this.parent.toLocal(e.global));
//             this.x = this.parent.toLocal(e.global).x;
//             this.y = this.parent.toLocal(e.global).y;
//         }
//     }

//     enableDragging() {
//         this.interactive = true;
//         this.on('pointerdown', this.onDragStart)
//             .on('pointerup', this.onDragEnd)
//             .on('pointermove', this.onDragMove)
//             .on('pointerupoutside', this.onDragEnd);
//     }
//     disableDragging() {
//         this.interactive = false;
//         this.off('pointerdown', this.onDragStart)
//             .off('pointerup', this.onDragEnd)
//             .off('pointermove', this.onDragMove)
//             .off('pointerupoutside', this.onDragEnd);
//     }

//     drawBlock() {
//         for (let i = 0; i < this.shape.length; i++) {
//             for (let j = 0; j < this.shape[i].length; j++) {
//                 if (this.shape[i][j] != 0) {
//                     let cell = new Cell(i * CELLSIZE / 2, j * CELLSIZE / 2);
//                     this.addChild(cell);
//                 }
//             }
//         }
//         app.stage.addChild(this);
//     }
// }