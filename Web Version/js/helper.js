// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a, b) {
    let ab = a.getBounds();
    let bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function calculateDistanceBetweenTwoPoints(pointA, pointB) {
    let xx = pointA.x - pointB.x;
    let yy = pointA.y - pointB.y;
    return Math.sqrt((xx * xx) + (yy * yy));
}

/**
 *  generates a random number between the specified values
 * @param {*} min 
 * @param {*} max 
 * @returns The returned value is no lower than (but may equal) min, and is less than (and not equal) max
 */
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

/**
 * rotates block 90deg clockwise n times
 * @param {*} block block to rotate
 * @param {*} times num of rotations
 */
function rotateBlock(block) {
    // if (4 < block.numPossForms <= 0) {
    //     console.log('NOTE: Rotating this block ' + times + ' will not change the block in a meaningful way');
    //     return;
    // }

    let currentShape = block.shape;
    let newShape = [];

    //the num of rows and columns are switched (2x3 -> 3x2)
    let numRows = currentShape[0].length;
    let numCols = currentShape.length;

    //transpose the shape 'matrix'
    for (let i = 0; i < numRows; i++) {
        newShape.push([]);
        for (let j = 0; j < numCols; j++) {
            newShape[i][j] = currentShape[j][i];
        }
    }

    //reverse the rows
    for (let i = 0; i < numRows; i++) {
        let endOfCol = numCols - 1;
        for (let j = 0; j < numCols / 2; j++) {
            let temp = newShape[i][j];
            newShape[i][j] = newShape[i][endOfCol];
            newShape[i][endOfCol] = temp;

            endOfCol--;
        }
    }
    return block.shape = newShape;;
}
