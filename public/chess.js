// globals
var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

var player_name = null
var gameID = null

async function fetchPosition() {
  const response = await fetch('/game?gameID=' + gameID, {
    method: 'GET',
    cors: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });

  const position = await response.json();
  board.position(position.fenString);

  document.querySelector('#whitePlayer').innerHTML = 'White Player: ' + position.whitePlayer;
  document.querySelector('#blackPlayer').innerHTML = 'Black Player: ' + position.blackPlayer;

  displayChatMessages(position.chat);

  updateStatus(new Chess(position.fenString))

  return position;
}

async function setPlayers(white = null, black = null) {
  let payload = 'gameID=' + gameID;
  if (white) {
    payload += '&whitePlayer=' + white
  }
  if (black) {
    payload += '&blackPlayer=' + black;
  }

  const response = await fetch('/game', {
    method: 'PUT',
    cors: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: payload
  });
  return response;
}

async function updatePosition(move) {
  const response = await fetch('/game/move', {
    method: 'POST',
    cors: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: "gameID=" + encodeURIComponent(gameID) + "&move=" + encodeURIComponent(move) + "&player=" + player_name
  });
}

function onDrop(source, target) {
  updatePosition(`${source}${target}`)
}

function updateStatus(game) {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  document.querySelector('#fen').innerHTML = game.fen();
  // document.querySelector('#pgn').innerHTML = game.pgn().;
  document.querySelector('#gameID').innerHTML = gameID;
}

var config = {
  draggable: true,
  position: 'start',
  onDrop: onDrop,
}
board = Chessboard('myBoard', config)
$(window).resize(board.resize)

// updateStatus(game)

setInterval(() => {
  if (gameID) {
    fetchPosition(gameID);
  }
}, 1000)