import * as yup from 'yup';
import { describe, expect, it, jest, test } from '@jest/globals';
import Login from '../pages/login';

jest.mock('axios');

describe('Login', () => {
  test('onSubmitForm calls onSubmit and router.push with correct arguments on successful submit', async () => {
    const mockOnSubmit = jest.fn();
    const mockPush = jest.fn();

    const mockData = { email: 'test@example.com', password: 'password' };
    const mockQuery = { redirect: '/dashboard' };

    const mockRouter = {
      push: mockPush,
      query: mockQuery,
    };

    const { onSubmitForm } = Login.prototype;

    await onSubmitForm.call({
      props: {
        onSubmit: mockOnSubmit,
      },
      context: {
        router: mockRouter,
      },
    }, mockData);

    expect(mockOnSubmit).toHaveBeenCalledWith(mockData);
    expect(mockPush).toHaveBeenCalledWith(mockQuery.redirect);
  });

  test('onSubmitForm sets serverErrors on failed submit', async () => {
    const mockOnSubmit = jest.fn(() => {
      throw { response: { data: 'Invalid credentials' } };
    });
    const mockSetServerErrors = jest.fn();

    const mockData = { email: 'test@example.com', password: 'password' };

    const { onSubmitForm } = Login.prototype;

    await onSubmitForm.call({
      props: {
        onSubmit: mockOnSubmit,
      },
      setState: mockSetServerErrors,
    }, mockData);

    expect(mockSetServerErrors).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });
});

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
