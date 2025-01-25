const fs = require('fs');
const itemsFilePath = './items.json';

//Reads the items JSON file and returns the JSON object.
const readItems = () => {
    try {
        const data = fs.readFileSync(itemsFilePath);
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

//Writes to the JSON file.
const writeItems = (items) => {
    const jsonString = JSON.stringify(items);
    fs.writeFileSync(itemsFilePath, jsonString);
};

module.exports = { readItems, writeItems };