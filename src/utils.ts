import { Cell } from './field/Cell';
import { Point } from './field/Field';


export interface Dictionary<T> {
    [key: string]: T
}

export const mapMatrixToCells = (matrix: number[][], offset: Point = { X: 0, Y: 0 }): Cell[][] => {
    return matrix.map((row, y) =>
        row.map((cell, x) =>
            new Cell(x + offset.X, y + offset.Y, cell))
    );
};

export const rotateMatrix = (matrix: number[][]): number[][] => {
    const colCount = matrix.length - 1;

    return matrix.map((row: number[], rowIndex: number) =>
        row.map((val: number, colIndex: number) => {
            return matrix ? matrix[colCount - colIndex] [rowIndex] : 0;
        })
    );
};

export const matrixToLinear = (matrix: Cell[][]): Cell[] => {
    return matrix.reduce((prevArray: Cell[], row: Cell[]) => [...prevArray, ...row]);
};

