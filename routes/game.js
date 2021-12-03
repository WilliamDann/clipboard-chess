const {Chessgame, generatorID} = require('../chessgame')
const {Chess} = require('chess.js');

module.exports = (app, db) => {
    app.post("/game", (req, res) => {
        const id = generatorID()

        db.games[id] = new Chessgame('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

        res.status(200);
        res.send({id: id});
    });

    app.get('/game', (req, res) => {
        if (!req.body.gameID) {
            res.status(400);
            res.send('No gameID specified');
            return;
        }

        if (!db.games[req.body.gameID]) {
            res.status(404);
            res.send("Game not found");

            return;
        }

        res.status(200);
        res.send(db.games[req.body.gameID]);
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
        const result    = chessgame.move(req.body.move);

        if (!result) {
            res.status(400);
            res.send("Invalid move");
            return;
        }

        db.games[req.body.gameID].fenString = chessgame.fen()

        res.status(200);
        res.send("Move made");
    });
}