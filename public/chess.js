var board     = null
var game      = new Chess()
var playerName = null
var gameID    = null

var clockInterval = null;
var whiteTime     = 0.00;
var blackTime     = 0.00;
var delay         = 0.00;

function onDrop(source, target) {
	const legals = game.moves();
	const result = game.move(`${source}${target}`, {sloppy: true})

	if (!result)
		return 'snapback';
	if (legals.indexOf(result.san) == -1)
		return 'snapback';
		
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
    document.querySelector('#whitePlayer').innerHTML = whitePlayer;
	document.querySelector('#blackPlayer').innerHTML = blackPlayer;
}

function updateClockDisplay() {
	const timeStr = time => `${~~((time % 3600) / 60)}:${~~time % 60}`;

	document.querySelector('#whiteClock').innerHTML = timeStr(whiteTime);
	document.querySelector('#blackClock').innerHTML = timeStr(blackTime);
}

function updateClockTimes(white, black, _delay) {
	whiteTime = white;
	blackTime = black;
	delay     = _delay;

	updateClockDisplay();

	if (!clockInterval)
		clockInterval = setInterval(() => {
			if (delay >= 0) 
				return delay -= 1;

			if (game.turn() == 'w')
				whiteTime -= 1
			else
				blackTime -= 1

			updateClockDisplay();
		}, 1000);
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