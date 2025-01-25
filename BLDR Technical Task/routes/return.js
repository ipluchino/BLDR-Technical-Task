const express = require('express');
const router = express.Router();
const FileIO = require('../FileIO');

//Helper function to find the correct index of the rental periods array to be made available. -1 is returned if the index could not be found.
const FindRentalPeriod = (rentalPeriods, returnDate) => {
    let index = 0;
    for (const rentalPeriod of rentalPeriods) {
        const rentalPeriodStartDate = new Date(rentalPeriod.startDate);
        const rentalPeriodEndDate = new Date(rentalPeriod.endDate);

        if (returnDate >= rentalPeriodStartDate && returnDate <= rentalPeriodEndDate) {
            return index;
        }

        index++;
    }

    //If a valid rental period was not found, return -1.
    return -1;
};

//Route to return an item and make it available for that rental period again.
router.post('/:id', async (req, res) => {
    const id = req.params.id;
    let { returnDate } = req.query;

    //Make sure that the request has a return date.
    if (!returnDate) {
        res.status(400).send('Invalid request, returnDate is required.');
        return;
    }

    //Make sure the return date is in a valid date format.
    returnDate = new Date(returnDate);

    if (isNaN(returnDate)) {
        res.status(400).send('Invalid request, returnDate must be in the format: 01-15-2025.');
        return;
    }

    //Make sure the ID could be found.
    const items = FileIO.readItems();
    const selectedItem = items.find(item => item.id === parseInt(id))
    if (!selectedItem) {
        res.status(400).send('Invalid request, the id of the item could not be found.');
        return;
    }

    //Remove the correct rental period from the item in the items JSON list.
    const index = FindRentalPeriod(selectedItem.rentalInformation.rentalPeriods, returnDate);

    //Make sure the rental period could be found.
    if (index === -1) {
        res.status(400).send('Invalid request, the return date does not match any of the defined rental periods.');
        return;
    }

    //If it can be found, remove that rental period from the item.
    selectedItem.rentalInformation.rentalPeriods.splice(index, 1);
    FileIO.writeItems(items);

    res.status(200).send('The item has been returned successfully.');
});

module.exports = router