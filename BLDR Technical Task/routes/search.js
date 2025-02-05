const express = require('express');
const router = express.Router();
const FileIO = require('../FileIO');

//Route to search for items to rent.
router.get('/', async (req, res) => {
    const { name, minPrice, maxPrice } = req.query;

    let items = FileIO.readItems();

    //Filter by name if a name parameter is provided.
    if (name) {
        items = items.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
    }

    //Filter by minPrice if a minPrice parameter is provided.
    if (minPrice) {
        const parsedMinPrice = parseFloat(minPrice);

        //Make sure the minPrice paramater is valid.
        if (isNaN(parsedMinPrice) || parsedMinPrice < 0) {
            res.status(400).send('Invalid request, minPrice must be a valid positive number.');
            return;
        }

        items = items.filter(item => item.pricePerDay >= parseFloat(minPrice));
    }

    //Filter by maxPrice is a maxPrice parameter is provided.
    if (maxPrice) {
        const parsedMaxPrice = parseFloat(maxPrice);

        //Make sure the maxPrice parameter is valid.
        if (isNaN(parsedMaxPrice) || parsedMaxPrice < 0) {
            res.status(400).send('Invalid request, maxPrice must be a valid positive number.');
            return;
        }

        items = items.filter(item => item.pricePerDay <= parseFloat(maxPrice));
    }

    //Sort by price order.
    items = items.sort((a, b) => parseFloat(a.pricePerDay) - parseFloat(b.pricePerDay));

    //Return the filtered JSON.
    res.status(200).json(items);
});

module.exports = router