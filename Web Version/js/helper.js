// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * rotates block 90deg clockwise n times
 * @param {*} block block to rotate
 * @param {*} times num of rotations
 */
function rotateBlock(block, times) {
    // if (4 < block.numPossForms <= 0) {
    //     console.log('NOTE: Rotating this block ' + times + ' will not change the block in a meaningful way');
    //     return;
    // }

    let currentShape = block.shape;

    for (let rot = 1; rot <= times; rot++) {
        let newShape = [];

        //the num of rows and columns are switched (2x3 -> 3x2)
        let numRows = currentShape[0].length;
        let numCols = currentShape.length;

        for (let i = 0; i < numRows; i++) newShape.push([]);

        //transpose the shape 'matrix'
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                newShape[i][j] = currentShape[j][i];
            }
        }

        //reverse the rows
        for (let i = 0; i < numRows; i++) {
            let endOfCol = numCols - 1;
            for (let j = 0; j < numCols; j++) {
                let temp = newShape[i, j];
                newShape[i, j] = newShape[i, endOfCol];
                newShape[i, endOfCol] = temp;

                endOfCol--;
            }
        }

        currentShape = newShape;
    }

    block.shape = currentShape;
    return block.shape;
}
