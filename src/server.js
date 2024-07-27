const express = require('express');
const bodyParser = require('body-parser');
const applicationRoutes = require('./routes/applicationRoutes');

require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/applications', applicationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
