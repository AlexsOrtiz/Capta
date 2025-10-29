import { Holiday, HOLIDAYS_URL } from './types';

/**
 * Servicio para manejar los días festivos colombianos
 */
export class HolidaysService {
  private holidays: Set<string> = new Set();
  private lastFetch: number = 0;
  private cacheDuration: number = 24 * 60 * 60 * 1000; // 24 horas

  /**
   * Obtiene los días festivos desde la API y los almacena en cache
   */
  async fetchHolidays(): Promise<void> {
    const now = Date.now();

    // Si ya tenemos datos en cache y no han expirado, no hacemos nada
    if (this.holidays.size > 0 && (now - this.lastFetch) < this.cacheDuration) {
      return;
    }

    try {
      const response = await fetch(HOLIDAYS_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch holidays: ${response.status}`);
      }

      const data = await response.json() as Holiday[];

      this.holidays.clear();
      data.forEach((holidayDate: Holiday) => {
        // Ya viene en formato YYYY-MM-DD
        this.holidays.add(holidayDate);
      });

      this.lastFetch = now;
    } catch (error) {
      console.error('Error fetching holidays:', error);
      throw new Error('Failed to fetch holidays data');
    }
  }

  /**
   * Verifica si una fecha es festivo
   * @param date - Fecha a verificar
   * @returns true si es festivo, false en caso contrario
   */
  isHoliday(date: Date): boolean {
    const dateStr = this.formatDate(date);
    return this.holidays.has(dateStr);
  }

  /**
   * Formatea una fecha a YYYY-MM-DD usando componentes UTC
   */
  private formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Obtiene todas las fechas festivas (para debug)
   */
  getAllHolidays(): string[] {
    return Array.from(this.holidays);
  }
}

// Singleton
export const holidaysService = new HolidaysService();
