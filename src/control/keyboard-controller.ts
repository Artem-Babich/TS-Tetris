import { Dictionary } from '../utils';

export const Actions: Dictionary<string> = {
    'rotate': 'ROTATE',
    'down':   'DOWN',
    'left':   'LEFT',
    'right':  'RIGHT',
};

export const KeyBinding: Dictionary<string> = {
    'ArrowUp':    Actions.rotate,
    'ArrowDown':  Actions.down,
    'ArrowLeft':  Actions.left,
    'ArrowRight': Actions.right,
};

export const KEYBOARD_CONTROLLER_EVENTS = {
    'ActionExecuted': 'action',
};

export class KeyboardController extends EventTarget {
    constructor () {
        super();

        this.init();
    }

    private init (): void {
        document.addEventListener('keydown', this.keyDownHandler.bind(this));
    }

    private keyDownHandler (e: KeyboardEvent): void {
        const action = KeyBinding[e.key];

        if (action)
            this.dispatchEvent(KeyboardController.ActionExecutedConstructor(action));
    }

    private static ActionExecutedConstructor (action: string): CustomEvent<string> {
        return new CustomEvent(KEYBOARD_CONTROLLER_EVENTS.ActionExecuted, { detail: action });
    }
}
