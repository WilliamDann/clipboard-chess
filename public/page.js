const GID_LENGTH = 6;

/// UTIL FUNCS
document.addEventListener('touchstart', function(e) {e.preventDefault()}, false);
document.addEventListener('touchmove', function(e) {e.preventDefault()}, false);

function setGameID(gid) {
    if (gid.length != GID_LENGTH)
        return false;
    if (gid.substring(0, 1) != '7')
        return false;

    gameID = gid;
    return true;
}

// TODO use cache funcs
function storePlayerName(name, cache = false) {
    if (name.length == 0)
        return false;

    player_name = name;
    return true;
}

// TODO use cache funcs
function getPlayerName(useCache = false) {
    return document.querySelector('#playerName').value;
}

function destroyJoinPanel() {
    const info = document.querySelector("#join_info");

    if (!info)
        return;

    info.parentElement.removeChild(info);
}

function handleJoinGameButton() {
    if (!document.querySelector("#gameID").value)
        return alert('Invalid gameID');
    if (getPlayerName().length == 0)
        return alert("Please enter a name first.");

    setGameID(document.querySelector("#gameID").value)
    storePlayerName(getPlayerName());

    if (!sendJoinGameRequest())
        return alert('Failed to join game!');

    destroyJoinPanel();
}

async function handleChatSend() {
    const chatbox = document.querySelector('#chatInput');

    if (!chatbox.value || chatbox.value == "")
        return;

    debugger
    const response = await sendChatMessageRequest(chatbox.value);
    if (response.status != 200) {
        return alert(response.statusText)
    }

    chatbox.value = "";
}

async function handleNewGame(asWhite = true) {
    storePlayerName(getPlayerName());

    if (!player_name)
        return alert("Please enter a name first");

    const gameData = await sendCreateGameRequest(asWhite);
    gameID = gameData.id;

    destroyJoinPanel();
}

function clearMessages() {
    const container = document.querySelector('#messagesContainer');

    while (container.firstChild)
        container.removeChild(container.firstChild)
}

function addMessage(text) {
    const container = document.querySelector('#messagesContainer');

    const textelement = document.createElement('p');
    textelement.innerHTML = text;

    container.appendChild(textelement);
}

function displayChatMessages(chatMessages) {
    clearMessages()
    for (let message of chatMessages)
        addMessage(message);
}
///

/// FETCH FUNCS

async function sendJoinGameRequest() {
    const response = await fetchPosition();
    const playerAlreadyJoined = player_name == response.whitePlayer || player_name == response.blackPlayer;

    if (playerAlreadyJoined)
        return true;

    if (!response.whitePlayer) {
        const response = await setPlayers(player_name);
        return response.status == 200;
    }
    if (!response.blackPlayer) {
        const response = await setPlayers(null, black = player_name)
        return response.status == 200;
    }

    return false;
}

async function sendCreateGameRequest(whitePlayer = true) {
    const payload = whitePlayer ? 'whitePlayer=' + player_name : 'blackPlayer=' + player_name;

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

async function sendChatMessageRequest(message) {
    const payload = `gameID=${gameID}&playerName=${player_name}&message=${message}`;
    const response = await fetch('/game/chat', {
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

    return await response;
}

///

/// Cache Funcs
/**
 * We should ask the user name and set the cookie to expires in 15 minutes.
 * If the user reload the page, it should show the message welcome the user back.
 * Cookies should be display on the page.
 * @param {*} user_name 
 * @param {*} u_value 
 * @param {*} minutes 
 */
function settingCookies(user_name, u_value, minutes) {

    let date = new Date();
    date / setTimeout(date.getTime() + (minutes * 60 * 60 * 1000));
    let cookie_expires = "Cookie expires in " + date.toUTCString();
    document.cookie = user_name + ", " + u_value + ". " + cookie_expires + ";path=/";

}
/**
* To get specific cookie from the cookie string
* @param {*} u_name 
* @returns 
*/
function getCookies(u_name) {

    let name = u_name + ", ";
    let decodedCookies = decodeURIComponent(document.cookie);
    let decode_do = decodedCookies.split(';');

    for (let i = 0; i = decode_do.length; i++) {
        let c = decode_do[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return;
}

/**
* Check if the name is in the cookies.
*/
function ifCookieExists() {

    let user_input = getCookies("username");
    if (user_input != "")
        document.getElementById('message').innerHTML = "Welcome back, " + user_input;
    else
        document.getElementById('message').innerHTML = "Please enter your name and click send.";
}