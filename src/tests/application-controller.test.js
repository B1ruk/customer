const request = require('supertest');
const redis = require('../config/redis-config');
const app = require('../app'); // Assuming your Express app is exported from app.js

jest.mock('../config/redis-config', () => ({
  set: jest.fn(),
  get: jest.fn(),
}));

describe('Application API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /applications', () => {
    it('should create an application successfully', async () => {
      const applicationData = {
        purpose: 'Business',
        companyName: 'Test Company',
        entityType: 'LLC',
        businessActivity: 'Technology',
        countryOfIncorporation: 'USA',
        registrationNumber: '123456',
        dateOfIncorporation: '2020-01-01',
        directorName: 'John Doe',
        passportNumber: 'A12345678',
        applicantName: 'Jane Doe',
        email: 'jane.doe@example.com',
      };

      const response = await request(app)
        .post('/applications')
        .send(applicationData)
        .expect(201);

      expect(response.body.message).toBe('Application created');
      expect(response.body).toHaveProperty('id');
      expect(redis.set).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify({
          id: expect.any(String),
          ...applicationData,
          licenseRequirement: '',
          PENDING: expect.any(String),
        })
      );
    });

    it('should return an error for invalid email', async () => {
      const applicationData = {
        email: 'invalid-email',
        // Other required fields...
      };

      const response = await request(app)
        .post('/applications')
        .send(applicationData)
        .expect(400);

      expect(response.body.error).toBe('Invalid email address');
    });

    it('should prompt for banking license requirements', async () => {
      const applicationData = {
        purpose: 'Business',
        companyName: 'Banking Corp',
        entityType: 'LLC',
        businessActivity: 'Banking',
        countryOfIncorporation: 'USA',
        registrationNumber: '123456',
        dateOfIncorporation: '2020-01-01',
        directorName: 'John Doe',
        passportNumber: 'A12345678',
        applicantName: 'Jane Doe',
        email: 'jane.doe@example.com',
      };

      await request(app)
        .post('/applications')
        .send(applicationData)
        .expect(201);

      expect(redis.set).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify({
          id: expect.any(String),
          ...applicationData,
          licenseRequirement: 'Please provide the necessary banking licenses.',
          PENDING: expect.any(String),
        })
      );
    });
  });

  describe('PATCH /applications/:id/status', () => {
    it('should update the application status successfully', async () => {
      const applicationId = 'test-id';
      const status = 'APPROVED';

      redis.get.mockResolvedValue(
        JSON.stringify({
          id: applicationId,
          status: 'PENDING',
        })
      );

      await request(app)
        .patch('/applications/' + applicationId + '/status')
        .send({ status })
        .expect(200);

      expect(redis.set).toHaveBeenCalledWith(
        applicationId,
        JSON.stringify({
          id: applicationId,
          status,
        })
      );
    });

    it('should return an error for a non-existing application', async () => {
      const applicationId = 'non-existing-id';
      const status = 'APPROVED';

      redis.get.mockResolvedValue(null);

      const response = await request(app)
        .patch('/applications/' + applicationId + '/status')
        .send({ status })
        .expect(404);

      expect(response.body.error).toBe('Application not found');
    });
  });

  describe('GET /applications/:id', () => {
    it('should retrieve an application successfully', async () => {
      const applicationId = 'test-id';
      const applicationData = {
        id: applicationId,
        purpose: 'Business',
        // Other fields...
      };

      redis.get.mockResolvedValue(JSON.stringify(applicationData));

      const response = await request(app)
        .get('/applications/' + applicationId)
        .expect(200);

      expect(response.body).toEqual(applicationData);
    });

    it('should return an error for a non-existing application', async () => {
      const applicationId = 'non-existing-id';

      redis.get.mockResolvedValue(null);

      const response = await request(app)
        .get('/applications/' + applicationId)
        .expect(404);

      expect(response.body.error).toBe('Application not found');
    });
  });
});
