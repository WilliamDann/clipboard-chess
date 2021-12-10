var board     = null
var game      = new Chess()
var playerName = null
var gameID    = null

function onDrop(source, target) {
	emitMove(gameID, playerName, `${source}${target}`)
}

function updateStatus() {
	var status = ''
	
	var moveColor = 'White'
	if (game.turn() === 'b') {
		moveColor = 'Black'
	}
	
    if (game.in_checkmate()) {
		status = 'Game over, ' + moveColor + ' is in checkmate.'
	} else if (game.in_draw()) {
		status = 'Game over, drawn position'
	} else {
		status = moveColor + ' to move'
			if (game.in_check()) {
			status += ', ' + moveColor + ' is in check'
		}
	}
	
	document.querySelector('#status').innerHTML = status
	document.querySelector('#fen').innerHTML = game.fen();
	// document.querySelector('#pgn').innerHTML = game.pgn().;
	document.querySelector('#gameIDDisplay').innerHTML = gameID;
}
	
function updateBoard(fen) {
	game = new Chess(fen);
	board.position(fen, true)
}

function updatePlayers(whitePlayer, blackPlayer) {
    document.querySelector('#whitePlayer').value = whitePlayer;
	document.querySelector('#blackPlayer').value = blackPlayer;
}

function clearChatElement() {
    const element = document.querySelector('#messagesContainer')

    while (element.firstChild)
        element.removeChild(element.firstChild)
}

function addChatMessage(text) {
    const element = document.querySelector('#messagesContainer')

    const p = document.createElement('p');
    p.innerHTML = text;

    element.appendChild(p);
}

function updateChat(chatData) {
    clearChatElement();
    for (let message of chatData)
        addChatMessage(message);
}

var config = {
	draggable: true,
	position: 'start',
	onDrop: onDrop,
}
board = Chessboard('myBoard', config)
$(window).resize(board.resize)