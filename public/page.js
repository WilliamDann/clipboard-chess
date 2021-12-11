const sock = io()

function getPlayerName() {
    return document.querySelector('#playerName').value;
}

function getGameID() {
    return document.querySelector("#gameID").value;
}

function destroyPanel(id) {
    const panel = document.querySelector(id);

    panel.parentElement.removeChild(panel);
}

function setPanelVisibility(id, to=true) {
    const panel = document.querySelector(id)

    panel.style.visibility = to;
}

function handleUseClockClicked() {
    const elements = document.querySelectorAll('#timeControl *');

    for (let element of elements)
        element.disabled = !element.disabled;
}

function emitCreateGame(gameID, _playerName, white=true) {
    playerName = _playerName;

    const payload = {}

    payload.gameID     = gameID;
    payload.playerName = _playerName;
    payload.white      = white;

    sock.emit('create game', JSON.stringify(payload));

    destroyPanel('#join_info');
    setPanelVisibility('#game_info', 'visible');
    setPanelVisibility('#chat', 'visible');
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

    sock.emit('join game', JSON.stringify(payload));

    destroyPanel('#join_info');
    setPanelVisibility('#game_info', 'visible');
    setPanelVisibility('#chat', 'visible');
}

function emitUpdate(gameID) {
    sock.emit('update game', JSON.stringify({ gameID: gameID }) );
}

sock.on('update', message => {
    const data = JSON.parse(message);

    gameID = data.gameID; // TODO no global

    updateBoard(data.fenString);
    updateStatus();

    updatePlayers(data.whitePlayer, data.blackPlayer);
    updateChat(data.chat);
});

sock.on('error', message => {
    console.error(`Websocket Error: ${message}`);
    emitUpdate(gameID);
});