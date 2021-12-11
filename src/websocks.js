const id        = require('./id');
const Chessgame = require('./chessgame');
const { Chess } = require('chess.js');

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

module.exports = (socket, db) => {
    socket.on('create game', message => {
        const data = JSON.parse(message);
        const obj  = new Chessgame("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        
        if (!data.gameID)
            data.gameID = id()
        if (!data.playerName)
            return; // TODO error handling
        
        if (data.white)
            obj.whitePlayer = data.playerName;
        else
            obj.blackPlayer = data.playerName;

        socks.set(data.gameID, [socket])
        obj.gameID = data.gameID;

        db.games[data.gameID] = obj;
        updateClients(data.gameID, obj);
    });

    socket.on('join game', message => {
        const data = JSON.parse(message);
        
        if (!data.gameID)
            return; // TODO error handling
        if (!data.playerName)
            return // TODO error handling

        if (!db.games[data.gameID])
            return; // TOOD error handling

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

        return; // TODO error handling
    });

    socket.on('move', message => {
        const data = JSON.parse(message);

        if (!data.gameID)
            return; // TOOD error handling
        if (!data.playerName)
            return; // TODO error handling
        if (!data.move)
            return // TODO error handling

        if (!db.games[data.gameID])
            return; // TODO error handling

        const board  = new Chess(db.games[data.gameID].fenString);
        const legals = board.moves();

        if (board.turn() == 'w') {
            if (data.playerName != db.games[data.gameID].whitePlayer)
                return; // TODO error handling
        } else {
            if (data.playerName != db.games[data.gameID].blackPlayer)
                return; // TODO error handling
        }

        const result = board.move(data.move, {sloppy: true})


        if (!result)
            return; // TODO error handling

        // .move allows moves into check??
        if (legals.indexOf(result.san) == -1)
            return; // TODO error handling

        db.games[data.gameID].fenString = board.fen();

        updateClients(data.gameID, db.games[data.gameID]);
    });
}