const id   = require('../modules/game/id');
const Game = require('../modules/game/game');

module.exports = (socket, db) => {
    socket.on('create game', msg => onCreateGame(socket, msg, db));
    socket.on('join game',   msg => onJoinGame(socket, msg, db));
    socket.on('update game', msg => onUpdateRequest(socket, msg, db));
    socket.on('move', msg => onMove(socket, msg, db));
}

function onCreateGame(socket, message, db) {
    const data   = JSON.parse(message);
    const obj    = new Game();

    obj.gameID = id();

    if (!data.playerName)
        return socket.emit('error', 'No playerName was specified');
    if (data.sideToPlay != 'White' && data.sideToPlay != 'Black')
        data.sideToPlay = Math.random() >= 0.5 ? 'White' : 'Black';
        
    if (data.fenString)
        if (!obj.setPosition(data.fenString))
            return socket.emit('error', `${data.fenString} is not a valid FEN`);
    
    if (data.useClock) {
        let time = 0;
        time += parseFloat(data.tcMin * 60);
        time += parseFloat(data.tcSec);

        if (!time)
            return socket.emit('error', 'Invalid time control information');

        obj.clock.set(time);
        obj.useClock = true;
    }

    obj.addPlayer(data.playerName, data.sideToPlay);
    obj.registerWatcher(socket);
    obj.emitUpdate();

    db.games[obj.gameID] = obj;
}

function onJoinGame(socket, message, db) {
    const data          = JSON.parse(message);
    const requestedGame = db.games[data.gameID];

    if (!data.gameID)
        return socket.emit('error', 'No gameID in request');
    if (!data.playerName)
        return socket.emit('error', 'No playerName in request');
    if (!requestedGame)
        return socket.emit('error', `gameID ${data.gameID} does not exist`);

    const seats = requestedGame.openSeats();
    if (seats.length == 0)
        return socket.emit('error', 'No open seats in this game');
        
    if (requestedGame.useClock) {
        requestedGame.clock.start();
    }

    requestedGame.addPlayer(data.playerName, seats[0])
    requestedGame.registerWatcher(socket);
    requestedGame.emitUpdate();
}

function onUpdateRequest(socket, message, db) {
    const data          = JSON.parse(message);
    const requestedGame = db.games[data.gameID];

    if (!data.gameID)
        return socket.emit('error', 'No gameID in request')
    if (!requestedGame)
        return socket.emit('error', `gameID ${data.gameID} does not exist`);

    requestedGame.emitSingleUpdate(socket);
}

function onMove(socket, message, db) {
    const data          = JSON.parse(message);
    const requestedGame = db.games[data.gameID];

    if (!data.gameID)
        return socket.emit('error', 'No gameID in request');
    if (!data.playerName)
        return socket.emit('error', 'No playerName in request');
    if (!data.move)
        return socket.emit('error', 'No move in request');
    if (!requestedGame)
        return socket.emit('error', `gameID ${data.gameID} does not exist`);

    if (!requestedGame.move(data.move, data.playerName))
        return socket.emit('error', `${data.move} is not valid a valid move in this context`);
    
    requestedGame.emitUpdate();
}