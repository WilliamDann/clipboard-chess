const {Chessgame, generatorID} = require('../chessgame')

module.exports = (app, db) => {
    app.post("/game", (req, res) => {
        const id = generatorID()

        db.games[id] = new Chessgame('8/8/8/8/8/8/8/8');

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
        }

        if (!db.games[req.body.gameID]) {
            res.status(404);
            res.send("Game not found");
        }

        for (let key of Object.keys(req.body)) {
            if (key == 'gameID') continue;
            db.games[req.body.gameID][key] = req.body[key]
        }

        res.status(200);
        res.send("Item Updated.");
    });
}