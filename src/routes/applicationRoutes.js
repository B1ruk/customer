const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// Route to create a new application
router.post('/', applicationController.createApplication);

// Route to get an application by ID
router.get('/:id', applicationController.getApplication);

module.exports = router;
