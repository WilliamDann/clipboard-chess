const id          = require('./id');
const {blankGame} = require('./chessgame');
const { Chess }   = require('chess.js');

const socks = new Map()

function updateClients(gameID, game) {
    for (let client of socks.get(gameID))
        emitUpdate(client, game)
}

function emitUpdate(client, game) {
    const payload = game;

    delete payload.connectedSockets;    

    client.emit('update', JSON.stringify(payload));
}

function emitError(client, message) {
    client.emit('error', message)
}

module.exports = (socket, db) => {
    socket.on('create game', message => {
        const data = JSON.parse(message);
        const obj  = blankGame()

        if (!data.gameID)
            data.gameID = id()
        if (!data.playerName)
            return emitError(socket, "No playerName in request")
        if (!data.sideToPlay || data.sideToPlay == 'Random') {
            data.sideToPlay = Math.random() >= 0.5 ? 'White' : 'Black'
        }

        if (data.sideToPlay == "White")
            obj.whitePlayer = data.playerName;
        else
            obj.blackPlayer = data.playerName;

        if (data.useClock) {
            let time = 0;

            const tcMin = parseInt(data.tcMin);
            const tcSec = parseInt(data.tcSec)

            if (tcMin == NaN)
                return emitError(socket, "tcMin was invalid")
            if (tcSec == NaN)
                return emitError(socket, "tcMin was invalid")
            
            time += tcMin*60;
            time += tcSec;

            obj.whiteTime = time;
            obj.blackTime   = time;

            const incMin = parseInt(data.tcIncrementMin);
            const incSec = parseInt(data.tcIncrementSec)
            if (incMin !== NaN && incSec !== NaN) {
                let inc = 0;

                inc += incMin*60;
                inc += incSec;

                obj.increment = inc;
            }

            const delayMin = parseInt(data.tcDelayMin);
            const delaySec = parseInt(data.tcDelaySec)
            if (delayMin !== NaN && delaySec !== NaN) {
                let delay = 0;

                delay += delayMin*60;
                delay += delaySec;

                obj.increment = delay;
            }
        }

        socks.set(data.gameID, [socket])
        obj.gameID = data.gameID;

        db.games[data.gameID] = obj;
        updateClients(data.gameID, obj);
    });

    socket.on('join game', message => {
        const data = JSON.parse(message);
        
        if (!data.gameID)
            return emitError(socket, "No gameID in request")
        if (!data.playerName)
            return emitError(socket, "No playerName in request")

        if (!db.games[data.gameID])
            return emitError(socket, `Game ${data.gameID} not found`)

        if (!db.games[data.gameID].whitePlayer) {
            db.games[data.gameID].whitePlayer = data.playerName
            
            let temp = socks.get(data.gameID);
            temp.push(socket);
            socks.set(data.gameID, temp);

            updateClients(data.gameID, db.games[data.gameID])
            return;
        }

        if (!db.games[data.gameID].blackPlayer) {
            db.games[data.gameID].blackPlayer = data.playerName;

            let temp = socks.get(data.gameID);
            temp.push(socket);
            socks.set(data.gameID, temp);

            updateClients(data.gameID, db.games[data.gameID])
            return;
        }

        return emitError(socket, 'Game is full')
    });

    socket.on('update game', message => {
        const data = JSON.parse(message);

        if (!data.gameID)
            return emitError(socket, 'No gameID in request');
        if (!db.games[data.gameID])
            return emitError(socket, `Game ${data.gameID} was not found`)

        emitUpdate(socket, db.games[data.gameID]);
    });

    socket.on('move', message => {
        const data = JSON.parse(message);

        if (!data.gameID)
            return emitError(socket, 'No gameID in request')
        if (!data.playerName)
            return emitError(socket, 'No playerName in request')
        if (!data.move)
            return emitError(socket, 'No move in request')

        if (!db.games[data.gameID])
            return emitError(socket, `Game ${data.gameID} was not found`)

        const board  = new Chess(db.games[data.gameID].fenString);
        const legals = board.moves();

        if (board.turn() == 'w') {
            if (data.playerName != db.games[data.gameID].whitePlayer)
                return emitError(socket, `${data.playerName} is not allowed to move now`)
        } else {
            if (data.playerName != db.games[data.gameID].blackPlayer)
                return emitError(socket, `${data.playerName} is not allowed to move now`)
        }

        const result = board.move(data.move, {sloppy: true})

        if (!result)
            return emitError(socket, 'Illegal move')

        // .move allows moves into check??
        if (legals.indexOf(result.san) == -1)
            return emitError(socket, 'Illegal move')

        db.games[data.gameID].fenString = board.fen();

        updateClients(data.gameID, db.games[data.gameID]);
    });
}