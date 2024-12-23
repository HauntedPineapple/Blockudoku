const CELLSIZE = 50; //px

const BLOCKSHAPES = {
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

// Colors
const GRIDCOLOR1 = '#D0EFB1'; //tea green
const GRIDCOLOR2 = '#B3D89C'; //celadon
const BLOCKCOLOR = '#64B6AC'; //verdigris
const BLOCKOUTLINE = '#45565E'; //outer space