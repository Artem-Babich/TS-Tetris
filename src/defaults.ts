import { Size } from './field/Field';

export const DEFAULT_START_Y         = -1;
export const DEFAULT_START_SPEED             = 295;
export const DEFAULT_MAX_SPEED               = 400;
export const DEFAULT_DISPLAYED_FIGURES_COUNT = 1;
export const DEFAULT_SCORE_MULTIPLIER = 100;

export const DEFAULT_FIELD_SIZE: Size = {
    Width:  10,
    Height: 20,
};

export const SHAPES = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'O': [
        [1, 1],
        [1, 1],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
};

export const FIGURE_COLORS = {
    'I': 'red',
    'J': 'blue',
    'L': 'purple',
    'O': 'yellow',
    'S': 'green',
    'Z': 'cyan',
    'T': 'orange',
};
