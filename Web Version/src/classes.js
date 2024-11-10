class Block extends PIXI.Container {
    constructor(x = 0, y = 0, shapeObj, dragFunc) {
        super();

        this.x = x;
        this.y = y;

        this.shape = shapeObj.shape;
        this.numPossRots = shapeObj.numForms; // # of possible forms through 90deg rotations

        this.normalForm = new PIXI.Container();
        this.normalForm.label = 'normalForm container';
        this.draggingForm = new PIXI.Container();
        this.draggingForm.label = 'draggingForm container';
        this.currentForm = 'normal';

        this.dragFunc = dragFunc;
        this.enableInteractivity();

        this.value = 0;
        for (let i = 0; i < this.shape.length; i++)
            for (let j = 0; j < this.shape[0].length; j++)
                if (this.shape[i][j] == 1) this.value++;

        // this.randomizeRotation();
        this.makeBlock();

    }

    makeBlock() {
        for (let i = 0; i < this.shape[0].length; i++) {
            for (let j = 0; j < this.shape.length; j++) {
                if (this.shape[j][i] != 0) {
                    let cell = new PIXI.Graphics();
                    cell.position = new PIXI.Point(CELLSIZE * i, CELLSIZE * j);
                    cell.beginFill(BLOCKCOLOR);
                    cell.lineStyle(4, BLOCKOUTLINE, 1);
                    cell.drawRect(0, 0, CELLSIZE, CELLSIZE);
                    cell.endFill();
                    cell.label = 'normalForm block cell';

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
                    cell.beginFill(BLOCKCOLOR);
                    cell.lineStyle(4, BLOCKOUTLINE, 1);
                    cell.drawRect(i * CELLSIZE, j * CELLSIZE, CELLSIZE * 0.8, CELLSIZE * 0.8);
                    cell.endFill();
                    cell.label = 'draggingForm block cell';

                    this.draggingForm.addChild(cell);
                }
            }
        }
        this.addChild(this.draggingForm);
        this.draggingForm.visible = false;

        this.boundsArea = new PIXI.Rectangle(0, 0, CELLSIZE * 0.8, CELLSIZE * 0.8);
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
                rotateBlockShape(this);
        }
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