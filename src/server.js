const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');

const applicationRoutes = require('./routes/applicationRoutes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/applications', applicationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
