module.exports = (app, db) => {
    require('./chessgame')(app, db);
    require('./chat')(app, db);
}