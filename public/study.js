var board      = null
var game       = new Chess()
var playerName = null
var gameID     = null

var clockInterval = null;
var whiteTime     = 0.00;
var blackTime     = 0.00;
var delay         = 0.00;

function onDrop(source, target) {
	const legals = game.moves();
	const result = game.move(`${source}${target}`, {sloppy: true})
	
	updatePGN();

	if (!result)
		return 'snapback';
	if (legals.indexOf(result.san) == -1)
		return 'snapback';
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
	document.querySelector('#gameIDDisplay').innerHTML = gameID;
}
	
function updateBoard(fen) {
	game = new Chess(fen);
	board.position(fen, true)
}

function orientBoard(white=true) {
	board.orientation(white ? 'white' : 'black');
}

function updatePGN() {
	const pgnElement = document.querySelector('#game_pgn');

	pgnElement.innerHTML = game.pgn();
}

var config = {
	draggable: true,
	position: 'start',
	onDrop: onDrop,
}
board = Chessboard('myBoard', config)
$(window).resize(board.resize)