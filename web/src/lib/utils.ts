export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem('token');
};

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode<{exp: number}>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};