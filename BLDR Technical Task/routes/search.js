const express = require('express');
const router = express.Router();
const FileIO = require('../FileIO');

//Route to search for items to rent.
router.get('/', async (req, res) => {
    const { name, minPrice, maxPrice } = req.query;

    const items = FileIO.readItems();

    //Filter by name if a name parameter is provided.
    if (name) {
        items = items.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
    }

    //Filter by minPrice if a minPrice parameter is provided.
    if (minPrice) {
        const parsedMinPrice = parseFloat(minPrice);

        if (isNaN(parsedMinPrice)) {
            res.status(400).send('Invalid request, minPrice must be a valid number.');
            return;
        }

        items = items.filter(item => item.pricePerDay >= parseFloat(minPrice));
    }

    //Filter by maxPrice is a maxPrice parameter is provided.
    if (maxPrice) {
        const parsedMaxPrice = parseFloat(maxPrice);

        if (isNaN(parsedMaxPrice)) {
            res.status(400).send('Invalid request, maxPrice must be a valid number.');
            return;
        }

        items = items.filter(item => item.pricePerDay <= parseFloat(maxPrice));
    }

    //Return the filtered JSON.
    res.status(200).json(items);


});

module.exports = router