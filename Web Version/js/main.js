"use strict";
const app = new PIXI.Application(600, 700);
document.body.appendChild(app.view);

// http://pixijs.download/dev/docs/PIXI.Graphics.html
const square = new PIXI.Graphics();
square.beginFill(0xFF0000); 	// red in hexadecimal
square.lineStyle(3, 0xFFFF00, 1); // lineWidth,color in hex, alpha
square.drawRect(0, 0, 40, 40); 	// x,y,width,height
square.endFill();
square.x = 25;
square.y = 50;
app.stage.addChild(square);  	// now you can see it

let line = new PIXI.Graphics();
line.lineStyle(4, 0xFF0000, 1);
line.moveTo(0, 0);
line.lineTo(590, 0);
line.x = 5;
line.y = 100;
app.stage.addChild(line);

class Circle extends PIXI.Graphics{
	constructor(radius=20, color=0xFF0000, x=0, y=0){
		super();
		this.radius = radius;
		this.x = x;
		this.y = y;
		this.beginFill(color);
		this.drawCircle(0,0,radius);
		this.endFill();
		
		// other variables
		this.dx = Math.random() * 10 - 5;
		this.dy = Math.random() * 10 - 5;
	}
	
	move(){
		this.x += this.dx;
		this.y += this.dy;
	}
	
	reflectX(){
		this.dx *= -1;
	}
	
	reflectY(){
		this.dy *= -1;
	}
}

let c1 = new Circle()
c1.x = 100;
c1.y = 100;

let c2 = new Circle(50,0xFF00FF,200,200)

app.stage.addChild(c1);
app.stage.addChild(c2);

////////////////////////////////////////////////////////////////////

//#region Constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;
//#endregion

// pre-load the images
app.loader.
    add([
        "images/StartGame_Button.png",
        "images/StartOver_Button.png"
    ]);
//app.loader.onComplete.add(setup);
app.loader.load();

let stage;
let currentScore;
let startScene, gameScene, gameOverScene;
let startGameButton, startOverButton;
let gameOverText;

function setup() {
    stage = app.stage;
    startScene = new PIXI.Container();

    gameScene = new PIXI.Container();
    gameScene.visible = false;

    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;

    stage.addChild(startScene);
    stage.addChild(gameScene);
    stage.addChild(gameOverScene);
    createStartScene();
}

function createStartScene() {
    startGameButton = new PIXI.Sprite(PIXI.Texture.from('images/StartGame_Button.png'));
    startGameButton.x = 40;
    startGameButton.y = 300;
    startGameButton.interactive = true;
    startGameButton.buttonMode = true;
    startGameButton.on("pointerup", startGame);
    startGameButton.on("pointerover", e => e.target.alpha = 0.7);
    startGameButton.on("pointerout", e => e.currentTarget.alpha = 1.0);
    startScene.addChild(startGameButton);
}

function startGame() {
    startScene.visible = false;
    gameScene.visible = true;

    currentScore = 0;
}

function endGame() {
    gameOverScene.visible = true;
    gameScene.visible = false;

    startOverButton = new PIXI.Sprite(PIXI.Texture.from('images/StartOver_Button.png'));
    startOverButton.x = 40;
    startOverButton.y = 400;
    startOverButton.interactive = true;
    startOverButton.buttonMode = true;
    startOverButton.on("pointerup", startGame);
    startOverButton.on("pointerover", e => e.target.alpha = 0.7);
    startOverButton.on("pointerout", e => e.currentTarget.alpha = 1.0);
    gameOverScene.addChild(startOverButton);

    gameOverScene.removeChild(gameOverText);
    gameOverText = new PIXI.Text("GAME OVER!\nScore: " + currentScore);
    let textStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 75,
        fontFamily: "Montserrat",
        fontWeight: "bold",
        align: "center"
    });
    gameOverText.style = textStyle;
    gameOverText.x = 25;
    gameOverText.y = sceneHeight / 3 - 160;
    gameOverScene.addChild(gameOverText);
}

function gameLoop() { }