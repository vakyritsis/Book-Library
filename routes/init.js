const express = require('express');
const router = express.Router();
const initController = require('../controllers/init');

router.post('/', initController.initDb);

module.exports = router;
