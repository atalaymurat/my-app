const request = require('supertest');
const mongoose = require('mongoose');
const { createServer } = require('../../index'); // Modified this line
const Company = require('../../models/company/Company');
const { connectDB, closeDB, clearDB } = require('../test-utils');

// Mock dependencies if needed
jest.mock('../../helpers/cities', () => ({
  cities: ['MockCity']
}));

describe('Company Controller', () => {
  let app;
  let server;

  beforeAll(async () => {
    await connectDB();
    // Create server instance
    const appConfig = createServer(); // Modified this line
    app = appConfig.app;
    server = appConfig.server;
  });

  beforeEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await closeDB();
    await server.close(); // Close the server
  });

  describe('POST /api/company', () => {
    it('should create a new company', async () => {
      const testData = {
        title: 'Test Company',
        vatNo: 'TEST123',
        emails: ['test@company.com']
      };

      const response = await request(app)
        .post('/api/company') // Make sure this matches your actual route
        .send(testData)
        .expect(201); // Changed from 200 to 201 for created resources

      expect(response.body).toMatchObject({
        message: expect.any(String),
        company: {
          title: 'Test Company',
          vatNo: 'TEST123',
          emails: ['test@company.com']
        }
      });

      // Verify in database
      const dbCompany = await Company.findOne({ vatNo: 'TEST123' });
      expect(dbCompany).toBeTruthy();
      expect(dbCompany.title).toBe('Test Company');
    });
  });
});