import { Point, Size } from './Field';
import { Cell } from './Cell';
import { SHAPES } from '../defaults';
import {
    mapMatrixToCells, matrixToLinear, rotateMatrix,
} from '../utils';

export class Figure {
    protected matrix: number[][];
    protected x: number;
    protected y: number;
    protected fieldSize: Size;
    public type: string;

    constructor (shape: number[][], type: string, { X, Y }: Point, fieldSize: Size) {
        this.matrix = shape.map(row =>
            row.map(cell =>
                cell > 0 ? Object.keys(SHAPES).indexOf(type) + 1 : 0)
        );

        this.type      = type;
        this.x         = X;
        this.y         = Y;
        this.fieldSize = fieldSize;
    }

    public Move (direction: Point): void {
        this.X += direction.X;
        this.Y += direction.Y;
    }

    public CanMove (direction: Point, field: Cell[][]): boolean {
        const getFieldCell: (x: number, y: number) => Cell = (x: number, y: number) => field[y][x];

        return this.LinerCellsWithoutEmpty.reduce((isValidMove: boolean, currentCell: Cell) => {
            return isValidMove &&
                currentCell.X + direction.X < this.fieldSize.Width &&
                currentCell.Y + direction.Y < this.fieldSize.Height &&
                currentCell.X + direction.X >= 0 &&
                currentCell.Y + direction.Y >= 0 &&
                getFieldCell(currentCell.X + direction.X, currentCell.Y + direction.Y).Empty;
        }, true);
    }

    get Matrix (): number[][] {
        return this.matrix;
    }

    get LinerCellsWithoutEmpty (): Cell[] {
        return this.LinerCellsArray.filter(c => c.Content !== 0);
    }

    get LinerCellsArray (): Cell[] {
        return matrixToLinear(mapMatrixToCells(this.matrix, this.Position));
    }

    get Position (): Point {
        return { X: this.x, Y: this.y };
    }

    get X (): number {
        return this.x;
    }

    set X (val: number) {
        this.x = val;
    }

    get Y (): number {
        return this.y;
    }

    set Y (val: number) {
        this.y = val;
    }

    public Rotate (): void {
        this.matrix = rotateMatrix(this.matrix);
    }

    public CanRotate (field: Cell[][]): boolean {
        const getFieldCell: (x: number, y: number) => Cell = (x: number, y: number) => field[y][x];
        const updatedMatrix                                = mapMatrixToCells(rotateMatrix(this.matrix), this.Position);
        const linearCells                                  = matrixToLinear(updatedMatrix).filter(c => c.Content !== 0);

        return linearCells.reduce((canMove: boolean, cell) =>
            canMove &&
                getFieldCell(cell.X, cell.Y) &&
                getFieldCell(cell.X, cell.Y).Empty
        , true);
    }

    // private getFigureBound (direction: Point) {
    //     const dimension = direction.X !== 0 ? 'X' : 'Y';
    //     const ctor      = direction[dimension] > 0 ? 'min' : 'max';
    //
    //     return Math[ctor](...this.LinerCellsWithoutEmpty.map(c => c[dimension]));
    // }
}
