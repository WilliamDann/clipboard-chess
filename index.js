const express = require('express');

const app     = express();
app.use(express.static('public'));

// TODO save database object
require('./routes/all')(app, {})

app.listen(8080, 'localhost', () => console.log("Running on localhost:8080"))