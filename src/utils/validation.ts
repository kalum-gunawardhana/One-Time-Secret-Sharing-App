import { FormErrors } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateAuthForm = (
  email: string,
  password: string,
  confirmPassword?: string
): FormErrors => {
  const errors: FormErrors = {};

  if (!email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email format';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters long';
  }

  if (confirmPassword !== undefined) {
    if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  return errors;
};

export const validateSecretForm = (
  message: string,
  password: string
): FormErrors => {
  const errors: FormErrors = {};

  if (!message.trim()) {
    errors.message = 'Message is required';
  }

  if (!password) {
    errors.secretPassword = 'Password is required';
  } else if (password.length < 4) {
    errors.secretPassword = 'Password must be at least 4 characters long';
  }

  return errors;
};