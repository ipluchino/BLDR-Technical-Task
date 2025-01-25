const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.status(200).send('Return Route!');
});

module.exports = router