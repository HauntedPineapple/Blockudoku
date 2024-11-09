"use strict";
const APP = new PIXI.Application({ 'width': 350, 'height': 350, 'backgroundColor': '#FCFCF4' });
document.body.querySelector("#pixicanvas").appendChild(APP.view);
APP.label = 'APP';

window.__PIXI_DEVTOOLS__ = { app: APP };

let dragTarget = null;
APP.stage.eventMode = 'static';
APP.stage.hitArea = APP.screen;
APP.stage.on('pointerup', onDragEnd);
APP.stage.on('pointerupoutside', onDragEnd);

function onDragStart() {
    dragTarget = this;
    dragTarget.alpha = 0.6;
    APP.stage.on('pointermove', onDragMove);
}

function onDragMove(e) {
    if (dragTarget)
        dragTarget.parent.toLocal(e.global, null, dragTarget.position);
}

function onDragEnd() {
    if (dragTarget) {
        APP.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        dragTarget = null;
    }
}


let testContainer1 = new PIXI.Container();
testContainer1.label = 'test container 1';
testContainer1.eventMode = 'static';
testContainer1.on('pointerdown', onDragStart, testContainer1);
testContainer1.position = new PIXI.Point(125, 125);

let testGraphic1 = new PIXI.Graphics();
testGraphic1.label = 'test graphic 1';
testGraphic1.beginFill('#EE964B');//orange
testGraphic1.drawRect(0, 0, CELLSIZE, CELLSIZE);
testGraphic1.endFill();
testContainer1.addChild(testGraphic1);

let testGraphic2 = new PIXI.Graphics();
testGraphic2.label = 'test graphic 2';
testGraphic2.beginFill('#599A39');//green
testGraphic2.x = CELLSIZE;
testGraphic2.y = 0;
testGraphic2.drawRect(0, 0, CELLSIZE, CELLSIZE);
testGraphic2.endFill();
testContainer1.addChild(testGraphic2);

testContainer1.pivot.x = testContainer1.width / 2;
testContainer1.pivot.y = testContainer1.height / 2;

APP.stage.addChild(testContainer1);
// APP.stage.addChild(testGraphic1);

function changeForm() {

}

//#region Buttons and Input
function showData() {
    document.body.querySelector("#output").innerHTML = '';
    displayData(testContainer1, testContainer1.label);
    displayData(testGraphic1, testGraphic1.label);
    displayData(testGraphic2, testGraphic2.label);
};
showData();

//#region PIXI Buttons
const button1 = new PIXI.Graphics();
button1.label = 'Button 1';
button1.beginFill('#EF3E36');
button1.drawRect(5, 5, 45, 45);
button1.eventMode = 'static';
button1.cursor = 'pointer';
button1.on('pointerdown', (e) => {
    console.log("Button 1 says: MEOW");
    testContainer1.rotation += Math.PI / 2;
});
APP.stage.addChild(button1);

const button2 = new PIXI.Graphics();
button2.label = 'Button 2';
button2.beginFill('#EF3E36');
button2.drawRect(60, 5, 45, 45);
button2.eventMode = 'static';
button2.cursor = 'pointer';
button2.on('pointerdown', (e) => {
    console.log("Button 2 says: MEOW");

    testContainer1.scale = new PIXI.Point(0.7, 0.7);
});
APP.stage.addChild(button2);

const button3 = new PIXI.Graphics();
button3.label = 'Button 3';
button3.beginFill('#EF3E36');
button3.drawRect(115, 5, 45, 45);
button3.eventMode = 'static';
button3.cursor = 'pointer';
button3.on('pointerdown', (e) => {
    console.log("Button 3 says: MEOW");
    testContainer1.scale = new PIXI.Point(1, 1);
});
APP.stage.addChild(button3);

const button4 = new PIXI.Graphics();
button4.label = 'Button 4';
button4.beginFill('#EF3E36');
button4.drawRect(170, 5, 45, 45);
button4.eventMode = 'static';
button4.cursor = 'pointer';
button4.on('pointerdown', (e) => {
    console.log("Button 4 says: MEOW");

    changeForm();
});
APP.stage.addChild(button4);

const button5 = new PIXI.Graphics();
button5.label = 'Button 5';
button5.beginFill('#EF3E36');
button5.drawRect(225, 5, 45, 45);
button5.eventMode = 'static';
button5.cursor = 'pointer';
button5.on('pointerdown', (e) => {
    console.log("Button 5 says: MEOW");

});
APP.stage.addChild(button5);

const button6 = new PIXI.Graphics();
button6.label = 'Button 6';
button6.beginFill('#EF3E36');
button6.drawRect(280, 5, 45, 45);
button6.eventMode = 'static';
button6.cursor = 'pointer';
button6.on('pointerdown', (e) => {
    console.log("Button 6 says: MEOW");
    showData();
});
APP.stage.addChild(button6);
//#endregion PIXI Buttons

//#region HTML Buttons
const ButtonA = document.body.querySelector("#aButton");
const ButtonB = document.body.querySelector("#bButton");
const ButtonC = document.body.querySelector("#cButton");
const ButtonX = document.body.querySelector("#xButton");
const ButtonY = document.body.querySelector("#yButton");
const ButtonZ = document.body.querySelector("#zButton");

ButtonA.innerHTML = "ButtonA";
ButtonA.addEventListener('click', (e) => {
    console.log('Button A says: owo');
});

ButtonB.innerHTML = "ButtonB";
ButtonB.addEventListener('click', (e) => {
    console.log('Button B says: XD');
});

ButtonC.innerHTML = "Clear Output Data";
ButtonC.addEventListener('click', (e) => {
    // console.log('Button C says: rawr');
    document.body.querySelector("#output").innerHTML = '';
});

ButtonX.innerHTML = "ButtonX";
ButtonX.addEventListener('click', (e) => {
    console.log('Button X says: UWU');

});

ButtonY.innerHTML = "ButtonY";
ButtonY.addEventListener('click', (e) => {
    console.log('Button Y says: meow');

});

ButtonZ.innerHTML = "ButtonZ";
ButtonZ.addEventListener('click', (e) => {
    console.log('Button Z says: Hewwo');

});
//#endregion

//#region Keyboard Inputs
document.addEventListener('keydown', (e) => {
    console.log(`\"${e.key}" key pressed`);
    if (e.key === ' ') {

    }
});
//#endregion Keyboard Inputs

//#endregion Buttons and Input