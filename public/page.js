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

function emitChat() {
    const payload = {
        playerName : playerName,
        gameID     : gameID,
        message    : document.querySelector('#chatInput').value
    }

    if (payload.message == '')
        return;

    sock.emit('game chat', JSON.stringify(payload));
    document.querySelector('#chatInput').value = '';
}

function emitCreateGame() {
    const payload = {
        playerName     : document.querySelector('#newGamePlayerName').value,
        useClock       : document.querySelector("#useClock").checked,
        
        tcMin          : document.querySelector('#tcMin').value,
        tcSec          : document.querySelector("#tcSec").value,
        tcIncrementMin : document.querySelector('#tcIncrementMin').value,
        tcIncrementSec : document.querySelector('#tcIncrementSec').value,
        tcDelayMin     : document.querySelector('#tcDelayMin').value,
        tcDelaySec     : document.querySelector('#tcDelaySec').value,

        sideToPlay     : document.querySelector('#sideToPlay').value
    }

    playerName = payload.playerName;

    sock.emit('create game', JSON.stringify(payload));

    destroyPanel('#join_info');
    destroyPanel('#create_info');

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
    destroyPanel('#create_info');

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
    updateClockTimes(data.clock.whiteTime, data.clock.blackTime);
    updateChat(data.chat);
});

sock.on('error', message => {
    console.error(`Websocket Error: ${message}`);

    // TODO better recursion prevention
    if (message == "No gameID in request") 
        return;

    emitUpdate(gameID);
});