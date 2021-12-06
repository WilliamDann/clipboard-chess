        // handle join game form submission
        document.querySelector("form").addEventListener('submit', event => {
            event.preventDefault(); // prevent page from doing usual redirects and stuff
  
            gameID = event.target.querySelector('#join_code').value;
  
            if (!player_name) 
              return alert ("Please enter a name first.");
            if (gameID == "")
              return alert ("Please enter the code of a game you wish to join.");
  
            console.log("Loaded:");
            console.log(player_name);
            console.log(gameID);
            console.log('---');
  
            joinGame();
  
            const info = document.querySelector("#info_panel");
            info.parentElement.removeChild(info);
          });
  
          async function joinGame() {
            const response = await fetchPosition();
            if (!response.whitePlayer) {
              return setPlayers(player_name)
            }
            if (!response.blackPlayer) {
              return setPlayers(null, black=player_name)
            }
  
            alert('No free space to join game!');
          }
  
          async function createNewGame(whitePlayer=true) {
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
              body: whitePlayer ? 'whitePlayer='+player_name : 'blackPlayer='+player_name // if white player then set whitePlayer to current user else set black player
            });
  
            const data = await response.json();
            return data.id;
          }
  
          async function handleNewGame(asWhite=true) {
            if (!player_name) 
              return alert("Please enter a name first");
  
            // send request to create new game
            const newid = await createNewGame();
  
            gameID = newid;
            console.log("Game created: " + newid);
            updateStatus()
  
            const info = document.querySelector("#info_panel");
            info.parentElement.removeChild(info);
          }
  
  