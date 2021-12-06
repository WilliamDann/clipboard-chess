const GID_LENGTH = 6;

/// UTIL FUNCS

function setGameID(gid) {
    if (gid.length != GID_LENGTH)
        return false;
    if (gid.substring(0, 1) != '7')
        return false;

    gameID = gid;
    return true;
}

// TODO use cache funcs
function setPlayerName(name, cache=false) {
    if (name.length == 0) 
        return false;

    player_name = name;
    return true;
}

// TODO use cache funcs
function getPlayerName(useCache=false) {
    return player_name;
}

function destroyJoinPanel() {
    const info = document.querySelector("#info_panel");

    if (!info) 
        return;

    info.parentElement.removeChild(info);
}

function handleJoinGameButton() {
    const joinPanel = document.querySelector("#info_panel");

    if (!setGameID(joinPanel.querySelector('#join_code').value))
        return alert('Invalid gameID');
    if (!player_name) 
        return alert ("Please enter a name first.");

    if (!sendJoinGameRequest())
        return alert('Failed to join game!');

    destroyJoinPanel();
}

async function handleNewGame(asWhite=true) {
    if (!player_name) 
      return alert("Please enter a name first");

    const gameData = await sendCreateGameRequest(asWhite);
    gameID         = gameData.id;

    updateStatus()

    destroyJoinPanel();
}
///

/// FETCH FUNCS

async function sendJoinGameRequest() {
    const response            = await fetchPosition();
    const playerAlreadyJoined = player_name == response.whitePlayer || player_name == response.blackPlayer;
    
    if (playerAlreadyJoined)
        return true;

    if (!response.whitePlayer) {
        const response = await setPlayers(player_name);
        return response.status == 200;
    }
    if (!response.blackPlayer) {
        const response = await setPlayers(null, black=player_name)
        return response.status == 200;
    }

    return false;
}

async function sendCreateGameRequest(whitePlayer=true) {
    const payload = whitePlayer ? 'whitePlayer='+player_name : 'blackPlayer='+player_name;

    const response = await fetch('/game', {
      method: 'POST',
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

    const data = await response.json();
    return data;
}

///

// set event to trigger on form submission
document.querySelector("form").addEventListener('submit', event => {
    event.preventDefault(); // prevent page from doing usual redirects and stuff
    handleJoinGameButton();
});
  
  