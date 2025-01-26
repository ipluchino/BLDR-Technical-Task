const express = require('express');
const router = express.Router();
const FileIO = require('../FileIO');

//Route to unlist an item from the item list.
router.post('/:id', async (req, res) => {
    const id = req.params.id;

    //Make sure the ID could be found.
    const items = FileIO.readItems();
    const selectedItem = items.find(item => item.id === parseInt(id))
    if (!selectedItem) {
        res.status(400).send('Invalid request, the id of the item could not be found.');
        return;
    }

    //Remove the item with the provided id.
    items.splice(parseInt(id) - 1, 1);
    FileIO.writeItems(items);

    res.status(200).send('The item has been unlisted successfully.');
});

module.exports = router