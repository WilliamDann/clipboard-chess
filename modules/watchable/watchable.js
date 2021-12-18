class Watchable {
    constructor(channel, watchers) 
    {
        this.channel = channel;

        if (!watchers)
            watchers = [];
        this.watchers = watchers;
    }

    registerWatcher(watcher) {
        if (this.watchers.indexOf(watcher) == -1)
            this.watchers.push(watcher);
    }

    unregisterWatcher(watcher) {
        this.watchers = this.watchers.filter(x => x != watcher);
    }

    emitSingleUpdate(socket) {
        const payload = Object.assign({}, this);

        delete payload.watchers;
        delete payload.channel;

        socket.emit(this.channel, JSON.stringify(payload));
    }

    emitUpdate() {
        const payload = Object.assign({}, this);

        delete payload.watchers;
        delete payload.channel;

        this.watchers.map(socket => socket.emit(this.channel, JSON.stringify(payload)))
    }
} module.exports = Watchable;