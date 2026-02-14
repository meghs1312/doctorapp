const express = require('express');
const cors = require('cors');
const doctorRoutes = require('./routes/doctorRoutes');
const constantsRoutes = require('./routes/constantsRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', doctorRoutes);
app.use('/api', constantsRoutes);
app.get('/', (req, res) => {
  res.send("Server is running ");
});

module.exports = app;
