'use client';
import axios from 'axios';
import { getToken } from '@/lib/auth';
import type { User } from '@/types';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const instance = axios.create({ baseURL, withCredentials: false });

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

function handleErr(err: any): never {
  const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Request failed';
  throw new Error(message);
}

export const api = {
  async register(payload: { name: string; email: string; password: string }) {
    const { data } = await instance.post('/api/auth/register', payload).catch(handleErr);
    return data;
  },
  async login(payload: { email: string; password: string }): Promise<{ token: string; user: User }> {
    const { data } = await instance.post('/api/auth/login', payload).catch(handleErr);
    return data;
  },
  async me(): Promise<User> {
    const { data } = await instance.get('/api/auth/me').catch(handleErr);
    return data;
  },
  async getUsers() {
    const { data } = await instance.get('/api/users').catch(handleErr);
    return data;
  },
  async getCandidates() {
    const { data } = await instance.get('/api/candidates').catch(handleErr);
    return data;
  },
  async createCandidate(payload: { name: string; party: string; photoUrl?: string }) {
    const { data } = await instance.post('/api/candidates', payload).catch(handleErr);
    return data;
  },
  async getElections() {
    const { data } = await instance.get('/api/elections').catch(handleErr);
    return data;
  },
  async createElection(payload: { title: string; startDate: string; endDate: string }) {
    const { data } = await instance.post('/api/elections', payload).catch(handleErr);
    return data;
  },
  async castVote(payload: { electionId: string; candidateId: string }) {
    const { data } = await instance.post('/api/votes', payload).catch(handleErr);
    return data;
  },
  async getResults(electionId: string) {
    const { data } = await instance.get(`/api/results/${electionId}`).catch(handleErr);
    return data;
  },
  async forgotPassword(email: string) {
    const { data } = await instance.post('/api/password/forgot', { email }).catch(handleErr);
    return data;
  },
  async resetPassword(token: string, password: string) {
    const { data } = await instance.post('/api/password/reset', { token, password }).catch(handleErr);
    return data;
  },
  async verifyOtp(payload: { email: string; otp: string }) {
    const { data } = await instance.post('/api/otp/verify', payload).catch(handleErr);
    return data;
  },
};
