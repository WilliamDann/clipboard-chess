const sock = io()

function getPlayerName() {
    return document.querySelector('#playerName').value;
}

function getGameID() {
    return document.querySelector("#gameID").value;
}

function emitCreateGame(gameID, _playerName, white=true) {
    playerName = _playerName;

    const payload = {}

    payload.gameID     = gameID;
    payload.playerName = _playerName;
    payload.white      = white;

    sock.emit('create game', JSON.stringify(payload));
}

function emitMove(gameID, playerName, move) {
    const payload = {}

    payload.gameID     = gameID;
    payload.playerName = playerName;
    payload.move       = move;

    sock.emit('move', JSON.stringify(payload))
}

function emitJoinGame(gameID, _playerName) {
    playerName = _playerName;
    
    const payload = {
        gameID: gameID,
        playerName: playerName
    }

    sock.emit('join game', JSON.stringify(payload))
}

sock.on('update', message => {
    const data = JSON.parse(message);

    gameID = data.gameID; // TODO no global

    updateBoard(data.fenString);
    updateStatus();

    updatePlayers(data.whitePlayer, data.blackPlayer);
    updateChat(data.chat);
});