const redis = require('../config/redis-config');

// Generate a unique ID for each application
const {v4: uuidv4} = require('uuid');
const validator = require('validator');
const {applicationStatus} = require('../model/applicationModel');


exports.createApplication = async (req, res) => {
    try {
        const {
            purpose,
            companyName,
            entityType,
            businessActivity,
            countryOfIncorporation,
            registrationNumber,
            dateOfIncorporation,
            directorName,
            passportNumber,
            applicantName,
            email,
        } = req.body;

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({error: 'Invalid email address'});
        }

        // Prompt license requirements if business activity is Banking
        let licenseRequirement = '';
        if (businessActivity === 'Banking') {
            licenseRequirement = 'Please provide the necessary banking licenses.';
        }

        const id = uuidv4();

        const {PENDING} = applicationStatus;

        const applicationData = {
            id,
            purpose,
            companyName,
            entityType,
            businessActivity,
            licenseRequirement,
            countryOfIncorporation,
            registrationNumber,
            dateOfIncorporation,
            directorName,
            passportNumber,
            applicantName,
            email,
            PENDING
        };

        // Store application data in Redis
        await redis.set(id, JSON.stringify(applicationData));

        res.status(201).json({message: 'Application created', id});
    } catch (error) {
        console.error('Error creating application:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};


exports.updateStatus = async (req, res) => {
    try {
        const {id, status} = req.body;

        let applicationData = await redis.get(id);
        if (applicationData && status) {
            const data = await redis.set({...applicationData, status});
            res.status(200).json(JSON.parse(data))
        }
    } catch (error) {
        res.status(500).json({error: 'Unable to update status'})
    }

}

exports.getApplication = async (req, res) => {
    try {
        const {id} = req.params;

        // Retrieve application data from Redis
        const applicationData = await redis.get(id);

        if (!applicationData) {
            return res.status(404).json({error: 'Application not found'});
        }

        res.json(JSON.parse(applicationData));
    } catch (error) {
        console.error('Error retrieving application:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

exports.getApplications = async (req, res) => {
    try {
        console.log(req);
        const keys = await redis.keys('*');
        let applicationDatas=[];

        for (let i=0;i<keys.length;i++){
            const applicationData = await redis.get(keys[i]);
            applicationDatas.push(JSON.parse(applicationData));
        }

        res.json(applicationDatas);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Unable to fetch applications'});
    }
}
