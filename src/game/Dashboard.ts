export const DASHBOARD_EVENTS = {
    'ScoreChanged': 'scorechanged',
};

export class Dashboard extends EventTarget {
    private score = 0;

    get Score (): number {
        return this.score;
    }

    set Score (val: number) {
        this.score = val;
        this.dispatchEvent(this.scoreChangedEventConstructor());
    }

    private scoreChangedEventConstructor (): CustomEvent<number> {
        return new CustomEvent(DASHBOARD_EVENTS.ScoreChanged, { detail: this.score });
    }
}
