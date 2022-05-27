import {
    DEFAULT_DISPLAYED_FIGURES_COUNT,
    DEFAULT_FIELD_SIZE,
    DEFAULT_MAX_SPEED,
    DEFAULT_START_SPEED, DEFAULT_START_Y,
    SHAPES,
} from '../defaults';
import { Cell } from './Cell';
import { Figure } from './Figure';
import { Dictionary } from '../utils';

export interface Point {
    X: number;
    Y: number;
}

export interface Size {
    Width: number;
    Height: number;
}

export const Direction: Dictionary<Point> = {
    'UP':    { X: 0, Y: -1 },
    'DOWN':  { X: 0, Y: 1 },
    'LEFT':  { X: -1, Y: 0 },
    'RIGHT': { X: 1, Y: 0 },
};

const TIMER_EVENTS = {
    'Tick': 'tick',
};

export const FIELD_EVENTS = {
    'Changed':           'changed',
    'RowFilled':         'rowfilled',
    'NextFigureChanged': 'nextfigurechanged',
    'TopRowFilled':      'toprowfilled',
};

class MovementTimer extends EventTarget {
    public onTick: Event;

    private _speed: number;
    private readonly startSpeed: number;
    private readonly maxSpeed: number;
    private timer: ReturnType<typeof setTimeout> | null = null;

    constructor (startSpeed?: number, maxSpeed?: number) {
        super();

        this.startSpeed = startSpeed || DEFAULT_START_SPEED;
        this._speed     = this.startSpeed;
        this.maxSpeed   = maxSpeed || DEFAULT_MAX_SPEED;
        this.onTick     = new Event(TIMER_EVENTS.Tick);
    }

    Start (): void {
        if (this.timer)
            return;

        this.timer = setTimeout(this._timerCallback.bind(this), this.timerInterval);
    }

    Pause (): void {
        if (this.timer)
            clearTimeout(this.timer);
    }

    Reset (): void {
        this.Pause();

        this.speed = this.startSpeed;

        this.Start();
    }

    private get timerInterval (): number {
        return this.maxSpeed * 2 - this._speed * 2;
    }

    private get speed (): number {
        return this._speed;
    }

    private set speed (val: number) {
        if (val * 2 >= this.maxSpeed)
            return;

        this._speed = val;
    }

    private _timerCallback (): void {
        this.speed += 1;

        this.dispatchEvent(this.onTick);

        if (this.timer)
            clearTimeout(this.timer);

        this.timer = setTimeout(this._timerCallback.bind(this), this.timerInterval);
    }
}

export class Field extends EventTarget {
    public movementTimer: MovementTimer;
    private readonly size: Size;
    private readonly displayedFiguresCount: number;
    private matrix: Cell[][]
    private figuresSequence: Figure[]
    private currentFigure: Figure;

    constructor (size?: Size, displayedFiguresCount?: number) {
        super();

        this.size                  = size || DEFAULT_FIELD_SIZE;
        this.matrix                = this.initFieldMatrix();
        this.movementTimer         = new MovementTimer();
        this.displayedFiguresCount = displayedFiguresCount || DEFAULT_DISPLAYED_FIGURES_COUNT;
        this.figuresSequence       = new Array<Figure>(this.displayedFiguresCount);
        this.currentFigure         = this.updateFigure();

        this.init();
    }

    public StartMove (): void {
        this.movementTimer.Start();
    }

    public PauseMove (): void {
        this.movementTimer.Pause();
    }

    private init (): void {
        this.movementTimer.addEventListener(TIMER_EVENTS.Tick, () => this.MoveFigure.bind(this)(Direction.DOWN));
    }

    public MoveFigure (direction: Point): void {
        if (this.currentFigure.CanMove(direction, this.matrix)) {
            this.currentFigure.Move(direction);
            this.dispatchEvent(this.fieldChangedEventConstructor());
        }
        else if (direction === Direction.DOWN) {
            if (this.currentFigure.X === Math.floor(this.size.Width / 2 - this.currentFigure.Matrix.length / 2) && this.currentFigure.Y === DEFAULT_START_Y) {
                this.PauseMove();
                this.dispatchEvent(Field.topRowFilledConstructor());
            }

            this.dropFigure(this.currentFigure);
            this.currentFigure = this.updateFigure();
            this.updateFilledRows();
            this.dispatchEvent(Field.figureChangedConstructor(this.figuresSequence[0]));
            this.dispatchEvent(this.fieldChangedEventConstructor());
        }
    }

    private updateFilledRows (): void {
        const resultMatrix     = this.matrix.filter(row => row.some(c => c.Empty));
        const missingRowsCount = this.size.Height - resultMatrix.length;

        if (!missingRowsCount)
            return;

        for (let i = 0; i < missingRowsCount; i++) {
            const y = missingRowsCount - i;

            resultMatrix.unshift([...new Array(this.size.Width)].map((_cv, x: number) => new Cell(x, y)));
        }

        this.matrix = resultMatrix.map((row, y: number) =>
            row.map((cell, x: number) => new Cell(x, y, cell.Content))
        );
        this.dispatchEvent(Field.rowFilledEventConstructor(missingRowsCount));
    }


    private updateFigure (): Figure {
        if (!this.currentFigure)
            this.figuresSequence = [...this.figuresSequence].map(() => this.generateRandomFigure());

        const figure = this.generateRandomFigure();

        this.figuresSequence.unshift(figure);

        return <Figure> this.figuresSequence.pop();
    }

    private generateRandomFigure (): Figure {
        const shapeNumber = Field.getRandomNumber(Object.keys(SHAPES).length);
        const shape       = Object.values(SHAPES)[shapeNumber];
        const shapeType   = Object.keys(SHAPES)[shapeNumber];

        return new Figure(shape, shapeType, {
            X: Math.floor(this.size.Width / 2 - shape.length / 2),
            Y: DEFAULT_START_Y,
        }, this.size);
    }

    private initFieldMatrix (): Cell[][] {
        return [...new Array(this.size.Height)].map((_rv, y: number) =>
            [...new Array(this.size.Width)].map((_cv, x: number) => new Cell(x, y))
        );
    }

    private static getRandomNumber (max: number): number {
        return Math.floor(Math.random() * max);
    }

    private fieldChangedEventConstructor (): CustomEvent {
        return new CustomEvent(FIELD_EVENTS.Changed, {
            detail: {
                matrix: this.matrix,
                figure: this.currentFigure,
            },
        });
    }

    private static rowFilledEventConstructor (rowsCount: number): CustomEvent {
        return new CustomEvent(FIELD_EVENTS.RowFilled, {
            detail: rowsCount,
        });
    }

    private static figureChangedConstructor (figure: Figure): CustomEvent<Figure> {
        return new CustomEvent(FIELD_EVENTS.NextFigureChanged, {
            detail: figure,
        });
    }

    private static topRowFilledConstructor (): CustomEvent<unknown> {
        return new CustomEvent(FIELD_EVENTS.TopRowFilled, {});
    }


    private dropFigure (currentFigure: Figure): void {
        const cellsToFill = currentFigure.LinerCellsWithoutEmpty;

        for (const cell of cellsToFill)
            this.matrix[cell.Y][cell.X].Content = cell.Content;

    }

    RotateFigure (): void {
        if (this.currentFigure.CanRotate(this.matrix)) {
            this.currentFigure.Rotate();
            this.dispatchEvent(this.fieldChangedEventConstructor());
        }
    }
}
