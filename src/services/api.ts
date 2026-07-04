import axios from 'axios';
import { SendIndividualPayload, SendGroupPayload, SendScheduledPayload, LogEntry, SessionStatus } from '../types';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (detail) return detail;
    if (err.message) return err.message;
  }
  return 'Something went wrong. Please try again.';
}

export async function sendIndividualMessage(payload: SendIndividualPayload) {
  try {
    const res = await api.post('/api/send/individual', payload);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function sendGroupMessage(payload: SendGroupPayload) {
  try {
    const res = await api.post('/api/send/group', payload);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function sendScheduledMessage(payload: SendScheduledPayload) {
  try {
    const res = await api.post('/api/send/scheduled', payload);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function fetchLogs(limit = 100): Promise<LogEntry[]> {
  try {
    const res = await api.get(`/api/logs?limit=${limit}`);
    return res.data.logs;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function clearLogs() {
  try {
    await api.delete('/api/logs');
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function fetchSessionStatus(): Promise<SessionStatus> {
  try {
    const res = await api.get('/api/session-status');
    return res.data;
  } catch (err) {
    return { connected: false, status: 'UNREACHABLE' };
  }
}