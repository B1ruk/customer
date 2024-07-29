const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// Route to create a new application
router.post('/', applicationController.createApplication);

// Route to get an application by ID
router.get('/onboarding/:id', applicationController.getApplication);

// Route to update the application stat
router.put('/',applicationController.updateStatus);

//Route to get all applications
router.get('/onboardings',applicationController.getApplications);

module.exports = router;
