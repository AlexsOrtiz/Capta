/**
 * Tipos e interfaces para la API de días hábiles
 */

export interface WorkingDaysRequest {
  days?: number;
  hours?: number;
  date?: string;
}

export interface WorkingDaysResponse {
  date: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export type Holiday = string; // Formato: "YYYY-MM-DD"

export interface WorkingHoursConfig {
  startHour: number;
  endHour: number;
  lunchStart: number;
  lunchEnd: number;
  timezone: string;
}

export const WORKING_HOURS: WorkingHoursConfig = {
  startHour: 8,      // 8:00 AM
  endHour: 17,       // 5:00 PM
  lunchStart: 12,    // 12:00 PM
  lunchEnd: 13,      // 1:00 PM
  timezone: 'America/Bogota'
};

export const HOLIDAYS_URL = 'https://content.capta.co/Recruitment/WorkingDays.json';
