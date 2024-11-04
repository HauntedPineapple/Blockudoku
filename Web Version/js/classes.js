class Block extends PIXI.Container {
    constructor(x = 0, y = 0, shapeObj, dragFunc) {
        super();

        this.x = x;
        this.y = y;

        this.shape = shapeObj.shape;
        this.numPossRots = shapeObj.numForms; // # of possible forms through 90deg rotations

        this.normalForm = new PIXI.Container();
        this.draggingForm = new PIXI.Container();
        this.currentForm = 'normal';
        
        this.dragFunc = dragFunc;
        this.enableInteractivity();
        
        this.value = 0;
        for (let i = 0; i < this.shape.length; i++)
            for (let j = 0; j < this.shape[0].length; j++)
        if (this.shape[i][j] == 1) this.value++;
        
        this.makeBlock();
        this.randomizeRotation();

    }

    makeBlock() {
        for (let i = 0; i < this.shape[0].length; i++) {
            for (let j = 0; j < this.shape.length; j++) {
                if (this.shape[j][i] != 0) {
                    let cell = new PIXI.Graphics();
                    cell.beginFill('#64B6AC');
                    cell.lineStyle(4, '#5D737E', 1);
                    cell.drawRect(i * CELLSIZE, j * CELLSIZE, CELLSIZE, CELLSIZE);
                    cell.endFill();

                    this.normalForm.scale = new PIXI.Point(0.65, 0.65);
                    this.normalForm.addChild(cell);
                }
            }
        }
        this.addChild(this.normalForm);
        this.normalForm.visible = true;

        this.pivot.x = this.width / 2;
        this.pivot.y = this.height / 2;

        for (let i = 0; i < this.shape[0].length; i++) {
            for (let j = 0; j < this.shape.length; j++) {
                if (this.shape[j][i] != 0) {
                    let cell = new PIXI.Graphics();
                    cell.beginFill('#64B6AC');
                    cell.lineStyle(4, '#5D737E', 1);
                    cell.drawRect(i * CELLSIZE, j * CELLSIZE, CELLSIZE * 0.8, CELLSIZE * 0.8);
                    cell.endFill();

                    this.draggingForm.addChild(cell);
                }
            }
        }
        this.addChild(this.draggingForm);
        this.draggingForm.visible = false;

        this.boundsArea=new PIXI.Rectangle(0,0,CELLSIZE * 0.8,CELLSIZE * 0.8);
    }

    changeForms(toNormal = true) {
        if (toNormal) {
            this.currentForm = 'normal';
            this.normalForm.visible = true;
            this.draggingForm.visible = false;
        }
        else {
            this.currentForm = 'dragging';
            this.normalForm.visible = false;
            this.draggingForm.visible = true;
        }
    }

    randomizeRotation() {
        let randomNum = getRandomInt(0, this.numPossRots);
        if (randomNum > 0) {
            for (let i = 0; i < randomNum; i++)
                this.rotateBlock();
        }
    }

    rotateBlock() {
        this.rotation += Math.PI / 2;
        rotateBlock(this);
    }

    enableInteractivity() {
        this.interactive = true;
        this.eventMode = 'static';
        this.on('pointerdown', this.dragFunc, this);
    }

    disableInteractivity() {
        this.interactive = false;
        this.off('pointerdown', this.dragFunc, this);
    }
}

class BlockSprite {
    constructor(x = 0, y = 0, shape, texture, dragFunc, numPossForms = 1, currentForm = 1) {
        this.numPossForms = numPossForms; // # of possible forms through 90deg rotations
        this.currentForm = currentForm; // the current shape after being rotated 90Deg currentForm-1 times
        if (this.currentForm < 1) this.currentForm = 1;

        this.texture = texture;
        this.sprite = PIXI.Sprite.from(texture);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale = new PIXI.Point(0.5, 0.5);
        this.sprite.anchor.set(0.5);

        this.height = this.sprite.height;
        this.width = this.sprite.width;
        this.shape = shape;
        this.value = 0;
        for (let i = 0; i < this.shape.length; i++)
            for (let j = 0; j < this.shape[0].length; j++)
                if (this.shape[i][j] == 1) this.value++;

        // Create the hitbox points
        // ....
        // this.sprite.hitArea = new PIXI.Polygon(new PIXI.Point(x, y), new PIXI.Point(x, y));
        // this.sprite.hitArea = new PIXI.Polygon([x, y, x, y, x, y]);

        this.dragFunc = dragFunc;
        this.enableInteractivity();
        app.stage.addChild(this.sprite);
    }

    enableInteractivity() {
        this.sprite.interactive = true;
        this.sprite.eventMode = 'static';
        this.sprite.on('pointerdown', this.dragFunc, this);
    }

    disableInteractivity() {
        this.sprite.interactive = false;
        this.sprite.off('pointerdown', this.dragFunc, this);
    }

    rotate() {
        this.sprite.rotation += Math.PI / 2;
        rotateBlock(this);
    }

    release() {
        this.disableInteractivity();
        this.sprite.destroy();
    }
}