class Clock {
    constructor() {
        this.whiteTime  = 0.00;
        this.blackTime  = 0.00;

        this.increment = 0.00;
        this.delay     = 0.00;

        this.lastUpdate = null;
    }

    set(time, increment, delay) {
        this.whiteTime = time;
        this.blackTime = time;

        this.increment = increment;
        this.delay     = delay;
    }

    start() {
        this.lastUpdate = Date.now();
    }

    hit(color) {
        if (!this.lastUpdate)
            this.start();

        const now     = Date.now();

        let elapsed   = (now - this.lastUpdate) - (this.delay * 1000);
        if (elapsed < 0.00)
            elapsed = 0.00;

        if (color == 'w') {
            this.whiteTime -= elapsed / 1000;
            this.blackTime += this.increment;
        }
        else {
            this.blackTime -= elapsed / 1000;
            this.whiteTime += this.increment;
        }

        this.lastUpdate = now;
    }

    get whiteLost() { return this.whiteTime <= 0.00 }
    get blackLost() { return this.blackTime <= 0.00 }

    get clockRunning() { return !this.whiteLost && !this.blackLost }

} module.exports = Clock;