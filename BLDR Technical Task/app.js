const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const fs = require('fs');

const app = express();

//Set up server console logging for testing purposes.
app.use(morgan('dev'));

//Set up the routing.
app.use('/list', require('./routes/list'));
app.use('/rent', require('./routes/rent'));
app.use('/return', require('./routes/return'));
app.use('/search', require('./routes/search'));

//Handle unknown routes.
app.use((req, res) => {
    res.status(404).send('Route could not be found. Please try again.');
});

//Create the JSON file to hold the item list if it doesn't already exist.
const itemsFilePath = './items.json';
if (!fs.existsSync(itemsFilePath)) {
    // If the file doesn't exist, create it with an empty array
    fs.writeFileSync(itemsFilePath, JSON.stringify([]));
    console.log('items.json file was created successfully.');
}

//Open the server.
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
    console.log('BLDR rental system listening on port ' + server.address().port);
});
