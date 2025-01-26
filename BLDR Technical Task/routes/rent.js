const express = require('express');
const router = express.Router();
const FileIO = require('../FileIO');

// Helper function to format a date as mm-dd-yyyy.
const FormatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so +1
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
};

//Helper function to check if a date range conflicts with pre-defined rental periods.
const IsOverlap = (item, startDate, endDate) => {
    for (rentalPeriod of item.rentalInformation.rentalPeriods) {
        const rentalPeriodStartDate = new Date(rentalPeriod.startDate);
        const rentalPeriodEndDate = new Date(rentalPeriod.endDate);

        //Checking if the start date overlaps.
        if (startDate >= rentalPeriodStartDate && startDate <= rentalPeriodEndDate) {
            return true;
        }

        //Checking if the end date overlaps.
        if (endDate >= rentalPeriodStartDate && endDate <= rentalPeriodEndDate) {
            return true;
        }
    }

    return false;
};

//Route to rent an item from the list of items.
router.post('/:id', async (req, res) => {
    const id = req.params.id;
    let { startDate, endDate } = req.query;

    //Make sure that the request has a start and end date.
    if (!startDate || !endDate) {
        res.status(400).send('Invalid request, startDate and endDate are required.');
        return;
    }

    //Make sure the start and end dates are in valid date formats.
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (isNaN(startDate) || isNaN(endDate)) {
        res.status(400).send('Invalid request, startDate and endDate must be in the format: 01-15-2025.');
        return;
    }

    //Make sure the ID could be found.
    const items = FileIO.readItems();
    const selectedItem = items.find(item => item.id === parseInt(id))
    if (!selectedItem) {
        res.status(400).send('Invalid request, the id of the item could not be found.');
        return;
    }

    //Make sure that the start date is before the end date.
    if (endDate <= startDate) {
        res.status(400).send('Invalid request, the provided startDate has to be before the endDate.');
        return;
    }

    //Make sure the dates do not overlap with already defined rental periods.
    if (IsOverlap(selectedItem, startDate, endDate)) {
        res.status(400).send('Invalid request, the requested rental period overlaps with already defined rental periods.');
        return;
    }

    //If the rental period is valid, add the rental period to the item.
    const formattedStartDate = FormatDate(startDate);
    const formattedEndDate = FormatDate(endDate);

    selectedItem.rentalInformation.rentalPeriods.push({
        startDate: formattedStartDate,
        endDate: formattedEndDate
    });

    //Sort the rental dates in date order.
    selectedItem.rentalInformation.rentalPeriods.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);

        return dateA - dateB;
    });

    //Update the JSON file containing the item list.
    FileIO.writeItems(items);

    res.status(200).send('The item has been rented successfully.');
});

module.exports = router