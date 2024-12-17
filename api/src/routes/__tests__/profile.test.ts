import request from 'supertest';

import { app } from '../../index';

describe('Profile API', () => {
  const mockProfile = {
    username: 'Test User',
    email: 'test@example.com',
    phone: '13333333333',
    bio: 'Test bio',
    avatar: 'https://example.com/avatar.jpg',
  };

  describe('GET /api/profile', () => {
    it('should return default profile data when no profile exists', async () => {
      const response = await request(app).get('/api/profile');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          username: 'Default User',
          email: 'user@example.com',
          phone: '',
          bio: '',
          avatar: '',
        }),
      );
    });

    it('should return saved profile data after creation', async () => {
      // First create a profile
      await request(app).put('/api/profile').send(mockProfile);

      // Then get the profile
      const response = await request(app).get('/api/profile');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(mockProfile);
    });
  });

  describe('PUT /api/profile - Required Fields', () => {
    it('should validate required field: username', async () => {
      const invalidProfile = {
        ...mockProfile,
        username: '',
      };

      const response = await request(app).put('/api/profile').send(invalidProfile);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', '姓名不能为空');
    });

    it('should validate username length', async () => {
      const invalidProfile = {
        ...mockProfile,
        username: 'a',
      };

      const response = await request(app).put('/api/profile').send(invalidProfile);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', '姓名至少需要2个字符');
    });

    it('should validate required field: phone', async () => {
      const invalidProfile = {
        ...mockProfile,
        phone: '',
      };

      const response = await request(app).put('/api/profile').send(invalidProfile);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', '手机号码不能为空');
    });

    it('should validate phone number format', async () => {
      const invalidProfile = {
        ...mockProfile,
        phone: '123456789',
      };

      const response = await request(app).put('/api/profile').send(invalidProfile);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', '请输入有效的手机号码');
    });
  });

  describe('PUT /api/profile - Email Validation', () => {
    it('should validate email format - invalid format', async () => {
      const invalidProfile = {
        ...mockProfile,
        email: 'invalid-email',
      };

      const response = await request(app).put('/api/profile').send(invalidProfile);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', '请输入有效的邮箱地址');
    });

    it('should validate email format - missing @ symbol', async () => {
      const invalidProfile = {
        ...mockProfile,
        email: 'testexample.com',
      };

      const response = await request(app).put('/api/profile').send(invalidProfile);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', '请输入有效的邮箱地址');
    });

    it('should validate email format - missing domain', async () => {
      const invalidProfile = {
        ...mockProfile,
        email: 'test@',
      };

      const response = await request(app).put('/api/profile').send(invalidProfile);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', '请输入有效的邮箱地址');
    });
  });

  describe('PUT /api/profile - Success Cases', () => {
    it('should successfully update profile with valid data', async () => {
      const response = await request(app).put('/api/profile').send(mockProfile);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('id');

      // Verify the update
      const getResponse = await request(app).get('/api/profile');
      expect(getResponse.body).toMatchObject(mockProfile);
    });

    it('should update profile with optional bio field', async () => {
      const profileWithBio = {
        ...mockProfile,
        bio: 'Updated bio information',
      };

      const response = await request(app).put('/api/profile').send(profileWithBio);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      const getResponse = await request(app).get('/api/profile');
      expect(getResponse.body.bio).toBe(profileWithBio.bio);
    });
  });
});
