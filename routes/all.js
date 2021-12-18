module.exports = (app, db) => {
    require('./game')(app, db);
    require('./chat')(app, db);
}