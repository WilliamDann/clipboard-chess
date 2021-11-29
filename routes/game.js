module.exports = (app, db) => {
    app.get('/ping', (req, res) => {
        res.status(200);
        res.send("Ping");
    });
}