
const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
require('dotenv').config();

const applicationRoutes = require('./routes/applicationRoutes');


const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/applications', applicationRoutes);

// Adding this route for eureka-status check
app.get('/health', (req, res) => {
  res.send({ "status":"UP"})
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
