const express = require('express');
const router = express.Router();
const {
  getAllStations,
  getStationByName
} = require('../controllers/stationController');

router.get('/', getAllStations);
router.get('/:name', getStationByName);

module.exports = router;
