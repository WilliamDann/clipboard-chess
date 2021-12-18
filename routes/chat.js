module.exports = (socket, db) => {
    socket.on('game chat', msg => onGameChat(socket, msg, db))
}

function onGameChat(socket, message, db) {
    const data = JSON.parse(message);
    const game = db.games[data.gameID]

    if (!data.gameID)
        return socket.emit('error', 'No gameID in reqest')
    if (!data.playerName)
        return socket.emit('error', 'No playerName in request');
    if (!data.message)
        return socket.emit('error', 'No message in request');
    if (!game)
        return socket.emit('error', `gameID ${date.gameID} does not exist`);

    if (data.playerName == game.whitePlayer || data.playerName == game.blackPlayer)
    {
        game.chat.push(`${data.playerName} : ${data.message}`);
        game.emitUpdate();
    }
    else
        return socket.emit('error', `${data.playerName} is not allowed to chat here`);
}