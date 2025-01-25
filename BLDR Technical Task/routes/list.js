const express = require('express');
const router = express.Router();
const FileIO = require('../FileIO');

//Helper function to validate a provided list of rental dates.
const ValidateRentalDates = (rentalDates) => {
    //The rental date list must be a JSON Object.
    let parsedRentalDates = {}
    try {
        parsedRentalDates = JSON.parse(rentalDates);
    }
    catch (error) {
        return false;
    }

    //The parsed JSON object must contain the "rentalPeriods" key.
    if (!('rentalPeriods' in parsedRentalDates)) {
        return false;
    }


    for (const rentalPeriod of parsedRentalDates.rentalPeriods) {
        //Ensure both a start date and end date was provided in the rental period.
        if (!('startDate' in rentalPeriod) || !('endDate' in rentalPeriod)) {
            return false;
        }

        const startDate = new Date(rentalPeriod.startDate);
        const endDate = new Date(rentalPeriod.endDate);

        //Both the starting and ending date in the rental period must be in a valid date format.
        if (isNaN(startDate) || isNaN(endDate)) {
            return false;
        }

        //The start date must be before the end date.
        if (endDate <= startDate) {
            return false;
        }
    }
    return true;
};

//Route to add an item to the list of items that can be rented.
router.post('/', async (req, res) => {
    //Extract the parameters from the request.
    const { name, description, pricePerDay, rentalDates } = req.query;

    //Make sure the request is in the correct format.
    if (!name || !pricePerDay) {
        res.status(400).send('Invalid request, name and pricePerDay is required.');
        return;
    }

    if (isNaN(pricePerDay) || pricePerDay < 0) {
        res.status(400).send('Invalid request, pricePerDay must be a positive number.');
        return;
    }

    if (!ValidateRentalDates(rentalDates)) {
        res.status(400).send('Invalid request, rentalDates must be a JSON object with the following format: {\"rentalPeriods\":[{\"startDate\":\"05-05-2025",\"endDate\":\"05-10-2025\"}]}');
        return;
    }

    //Create the new item.
    items = FileIO.readItems();

    //Sort the rentalDates into date order.
    const parsedRentalDates = JSON.parse(rentalDates);
    parsedRentalDates.rentalPeriods.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);

        return dateA - dateB;
    });

    item = {
        id: items.length + 1,
        name: name,
        description: description,
        pricePerDay: pricePerDay,
        rentalDates: parsedRentalDates || []
    };

    //Add the item to the items JSON list.
    items.push(item);
    FileIO.writeItems(items);

    res.status(200).send('The item has been added successfully.');
});

module.exports = router