export type Mode = 'individual' | 'group' | 'schedule';

export interface SendIndividualPayload {
  phone_number: string;
  message: string;
  country_code?: string;
}

export interface SendGroupPayload {
  group_id: string;
  message: string;
}

export interface SendScheduledPayload {
  receiver_type: 'individual' | 'group';
  receiver_id: string;
  message: string;
  scheduled_time: string;
  country_code?: string;
}

export interface LogEntry {
  timestamp: string;
  receiver_type: 'individual' | 'group';
  receiver_id: string;
  message: string;
  status: 'success' | 'failed';
  error?: string | null;
}

export interface SessionStatus {
  connected: boolean;
  status: string;
}