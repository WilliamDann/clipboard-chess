module.exports = (app, db) => {
    // add all new routes here
    require('./game')(app, db)
    require('./user')(app, db)
}