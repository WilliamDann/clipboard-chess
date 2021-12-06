const {Chessgame, generatorID} = require('../chessgame')
const {Chess} = require('chess.js');

module.exports = (app, db) => {
    app.post("/game", (req, res) => {
        const id = generatorID()

        db.games[id] = new Chessgame('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

        if (req.body.whitePlayer)
            db.games[id].whitePlayer = req.body.whitePlayer
        if (req.body.blackPlayer)
            db.games[id].blackPlayer = req.body.blackPlayer

        res.status(200);
        res.send({id: id});
    });

    app.get('/game', (req, res) => {
        if (!req.query.gameID) {
            res.status(400);
            res.send('No gameID specified');
            return;
        }

        if (!db.games[req.query.gameID]) {
            res.status(404);
            res.send("Game not found");

            return;
        }

        res.status(200);
        res.send(db.games[req.query.gameID]);
    });

    app.delete('/game', (req, res) => {
        if (!req.body.gameID) {
            res.status(400);
            res.send('No gameID specified');
            return;
        }
    
        if (!db.games[req.body.gameID]) {
            res.status(404);
            res.send("Game not exists");
            return;
        }
    
        db.games[req.body.gameID] = undefined;
    
        res.status(200);
        res.send("Game deleted");
      });
    
    app.put('/game', (req, res) => {
        if (!req.body.gameID) {
            res.status(400);
            res.send("No gameId specified");
            return;
        }

        if (!db.games[req.body.gameID]) {
            res.status(404);
            res.send("Game not found");
            return;
        }

        for (let key of Object.keys(req.body)) {
            if (key == 'gameID') continue;
            db.games[req.body.gameID][key] = req.body[key]
        }

        res.status(200);
        res.send("Item Updated.");
    });

    app.post('/game/move', (req, res) => {
        if (!req.body.gameID) {
            res.status(400);
            res.send("No gameID specified");
            return;
        }

        if (!req.body.player) {
            res.status(400);
            res.send("No player was specified")
        }

        if (!req.body.move) {
            res.status(400);
            res.send("No move specified");
            return;
        }

        if (!db.games[req.body.gameID]) {
            res.status(404);
            res.send("Game not found");
            return;
        }

        const chessgame = Chess(db.games[req.body.gameID].fenString);
        if (chessgame.turn() == 'w') {
            if (db.games[req.body.gameID].whitePlayer != req.body.player) {
                res.status(400);
                return res.send("It is not your turn");
            }
        } else {
            if (db.games[req.body.gameID].blackPlayer != req.body.player) {
                res.status(400);
                return res.send("It is not your turn");
            }
        }

        const moves     = chessgame.moves();
        const result    = chessgame.move(decodeURIComponent(req.body.move), {sloppy: true});
        
        
        if (!result) {
            res.status(400);
            res.send("Invalid move");
            return;
        }
        
        // .move is allowing moves with check??
        if (moves.indexOf(result.san) == -1) {
            chessgame.undo();
            res.status(400);
            return res.send("Invalid move");
        }

        db.games[req.body.gameID].fenString = chessgame.fen()

        res.status(200);
        res.send("Move made");
    });
}