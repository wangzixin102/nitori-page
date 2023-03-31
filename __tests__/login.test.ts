import * as yup from 'yup';
import { describe, expect, it, jest, test, afterEach } from '@jest/globals';
import loginSchema from '../pages/login';

describe('Login Validation', () => {
  const loginSchema = yup.object({
    email: yup.string().required('Email is required').email('Invalid email address'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters long'),
  });

  it('should validate correct login form data', async () => {
    const validData = { email: 'user@example.com', password: 'password123' };
    await expect(loginSchema.validate(validData)).resolves.toBe(validData);
  });

  it('should fail to validate login form data with missing fields', async () => {
    const invalidData = { email: '', password: '' };
    await expect(loginSchema.validate(invalidData)).rejects.toThrow();
  });

  it('should fail to validate login form data with invalid email address', async () => {
    const invalidData = { email: 'invalidemail', password: 'password123' };
    await expect(loginSchema.validate(invalidData)).rejects.toThrow();
  });

  it('should fail to validate login form data with too short password', async () => {
    const invalidData = { email: 'user@example.com', password: 'pw' };
    await expect(loginSchema.validate(invalidData)).rejects.toThrow();
  });
});
