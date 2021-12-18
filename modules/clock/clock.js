class Clock {
    constructor() {
        this.whiteTime  = 0.00;
        this.blackTime  = 0.00;

        this.lastUpdate = null;
    }

    set(time) {
        this.whiteTime = time;
        this.blackTime = time;
    }

    start() {
        this.lastUpdate = Date.now();
    }

    hit(color) {
        if (!this.lastUpdate)
            this.start();

        const now = Date.now();

        if (color == 'w') {
            this.whiteTime -= (now - this.lastUpdate) / 1000;
        }
        else
            this.blackTime -= (now - this.lastUpdate) / 1000;

        this.lastUpdate = now;
    }

    get whiteLost() { return this.whiteTime <= 0.00 }
    get blackLost() { return this.blackTime <= 0.00 }

    get clockRunning() { return !this.whiteLost && !this.blackLost }

} module.exports = Clock;