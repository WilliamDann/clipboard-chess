const express = require('express');
const bodyParser = require('body-parser');

const app     = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// TODO save database object
require('./routes/all')(app, { games: {} })

app.listen(80, 'localhost', () => console.log("Running on localhost:80"))