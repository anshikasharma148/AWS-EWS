const stationModel = require('../models/stationModel');

exports.getAllStations = async (req, res) => {
  try {
    const stations = await stationModel.getAllStations();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stations', error });
  }
};

exports.getStationByName = async (req, res) => {
  const name = req.params.name;
  try {
    const station = await stationModel.getStationByName(name);
    if (station) {
      res.json(station);
    } else {
      res.status(404).json({ message: 'Station not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch station', error });
  }
};
