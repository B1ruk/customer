const express = require('express');
const bodyParser = require('body-parser');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/applications', applicationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
