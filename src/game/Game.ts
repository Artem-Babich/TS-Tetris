import { Drawer } from './Drawer';
import {
    Direction, Field, FIELD_EVENTS, Size,
} from '../field/Field';
import {
    Actions, KEYBOARD_CONTROLLER_EVENTS, KeyboardController,
} from '../control/keyboard-controller';
import { Dashboard, DASHBOARD_EVENTS } from './Dashboard';
import { DEFAULT_SCORE_MULTIPLIER } from '../defaults';

export interface GameOptions {
    fieldSize?: Size;
    displayedFiguresCount?: number
}

export class Game {
    private drawer: Drawer;
    private field: Field;
    private keyboardController: KeyboardController;
    private dashboard: Dashboard;

    constructor (gameCanvas: HTMLCanvasElement, dashboardCanvas: HTMLCanvasElement, {
        fieldSize,
        displayedFiguresCount,
    }: GameOptions = {}) {
        this.field              = new Field(fieldSize, displayedFiguresCount);
        this.drawer             = new Drawer(gameCanvas, dashboardCanvas);
        this.keyboardController = new KeyboardController();
        this.dashboard          = new Dashboard();

        this.Init();
    }

    public Start (): void {
        console.log('Game started');
        this.field.StartMove();
    }

    public Pause (): void {
        this.field.PauseMove();
    }

    public Restart (): void {
        throw new Error('NotImplemented');
    }

    private Init (): void {
        this.field.addEventListener(FIELD_EVENTS.Changed, (({ detail }: CustomEvent) => {
            if (detail)
                this.drawer.UpdateField(detail.matrix, detail.figure);

        }) as (e: Event) => void);

        this.field.addEventListener(FIELD_EVENTS.RowFilled, (({ detail }: CustomEvent) => {
            if (!detail)
                return;

            const score = detail * DEFAULT_SCORE_MULTIPLIER;

            this.dashboard.Score += score;
        }) as (e: Event) => void);

        this.field.addEventListener(FIELD_EVENTS.NextFigureChanged, (({ detail }: CustomEvent) => {
            if (!detail)
                return;

            this.drawer.UpdateDashboardFigure(detail);
        }) as (e: Event) => void);

        this.field.addEventListener(FIELD_EVENTS.TopRowFilled, (() => {
            this.drawer.ShowGameOverBanner();
        }) as (e: Event) => void);

        this.keyboardController.addEventListener(KEYBOARD_CONTROLLER_EVENTS.ActionExecuted, (({ detail }: CustomEvent) => {
            if (detail)
                this.processAction(detail);
        }) as (e: Event) => void);

        this.dashboard.addEventListener(DASHBOARD_EVENTS.ScoreChanged, (({ detail }: CustomEvent) => {
            if (detail)
                this.drawer.UpdateDashboardScore(detail);
        }) as (e: Event) => void);

    }

    private processAction (action: string): void {
        if (action === Actions.rotate)
            return this.field.RotateFigure();

        const direction = Direction[action];

        return this.field.MoveFigure(direction);
    }
}
