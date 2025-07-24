const express = require('express');
const cors = require('cors');
const stationRoutes = require('./routes/stationRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use('/api/stations', stationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
