import { WORKING_HOURS } from './types';
import { holidaysService } from './holidaysService';

/**
 * Calculadora de días y horas hábiles
 */
export class WorkingDaysCalculator {
  /**
   * Convierte una fecha UTC a hora de Colombia
   * Nota: No cambiamos el timestamp, solo interpretamos los componentes de fecha/hora
   * como si fueran hora de Colombia en lugar de UTC
   */
  private toColombiaTime(utcDate: Date): Date {
    // UTC a Colombia: restar 5 horas al momento UTC para obtener la hora local
    // Ejemplo: 2025-01-24T22:00:00Z (10 PM UTC) -> 2025-01-24T17:00:00 (5 PM Colombia)
    const colombiaTimestamp = utcDate.getTime() - 5 * 60 * 60 * 1000;

    // Creamos un objeto Date que representa ese momento
    // Pero trabajaremos con sus componentes UTC como si fueran hora de Colombia
    return new Date(colombiaTimestamp);
  }

  /**
   * Convierte una fecha de Colombia a UTC
   * Toma los componentes que hemos estado tratando como hora de Colombia
   * y los convierte de vuelta a UTC
   */
  private toUTC(colombiaDate: Date): Date {
    // Colombia a UTC: sumar 5 horas
    const utcTimestamp = colombiaDate.getTime() + 5 * 60 * 60 * 1000;
    return new Date(utcTimestamp);
  }

  /**
   * Verifica si una fecha es día laboral (lunes a viernes, no festivo)
   */
  private isWorkingDay(date: Date): boolean {
    const dayOfWeek = date.getUTCDay();
    // 0 = domingo, 6 = sábado
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }

    return !holidaysService.isHoliday(date);
  }

  /**
   * Normaliza una fecha al horario laboral más cercano (hacia atrás)
   * Si está fuera de horario o no es día laboral, ajusta al último momento laboral válido
   */
  private normalizeToWorkingTime(date: Date): Date {
    const result = new Date(date);

    // Si no es día laboral, retroceder al último día laboral a las 5:00 PM
    while (!this.isWorkingDay(result)) {
      result.setUTCDate(result.getUTCDate() - 1);
      result.setUTCHours(WORKING_HOURS.endHour, 0, 0, 0);
    }

    const hours = result.getUTCHours();
    const minutes = result.getUTCMinutes();
    const timeInMinutes = hours * 60 + minutes;

    // Antes de las 8:00 AM -> retroceder al día laboral anterior a las 5:00 PM
    if (timeInMinutes < WORKING_HOURS.startHour * 60) {
      result.setUTCDate(result.getUTCDate() - 1);
      result.setUTCHours(WORKING_HOURS.endHour, 0, 0, 0);
      // Volver a verificar si el día anterior es laboral
      return this.normalizeToWorkingTime(result);
    }

    // Durante el almuerzo (12:00 PM - 1:00 PM) -> ajustar a 12:00 PM
    if (timeInMinutes >= WORKING_HOURS.lunchStart * 60 && timeInMinutes < WORKING_HOURS.lunchEnd * 60) {
      result.setUTCHours(WORKING_HOURS.lunchStart, 0, 0, 0);
      return result;
    }

    // Después de las 5:00 PM -> ajustar a 5:00 PM del mismo día
    if (timeInMinutes >= WORKING_HOURS.endHour * 60) {
      result.setUTCHours(WORKING_HOURS.endHour, 0, 0, 0);
      return result;
    }

    // Ya está en horario laboral, mantener la hora actual
    return result;
  }

  /**
   * Obtiene el siguiente día laboral
   */
  private getNextWorkingDay(date: Date): Date {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + 1);

    while (!this.isWorkingDay(result)) {
      result.setUTCDate(result.getUTCDate() + 1);
    }

    return result;
  }

  /**
   * Suma días hábiles a una fecha
   */
  private addWorkingDays(startDate: Date, days: number): Date {
    let result = new Date(startDate);

    for (let i = 0; i < days; i++) {
      result = this.getNextWorkingDay(result);
    }

    return result;
  }

  /**
   * Suma horas hábiles a una fecha, respetando horario laboral y almuerzo
   */
  private addWorkingHours(startDate: Date, hours: number): Date {
    let result = new Date(startDate);
    let remainingMinutes = hours * 60;

    while (remainingMinutes > 0) {
      const currentHour = result.getUTCHours();
      const currentMinute = result.getUTCMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      // Si estamos en horario de almuerzo, saltar a las 1:00 PM
      if (currentTimeInMinutes >= WORKING_HOURS.lunchStart * 60 && currentTimeInMinutes < WORKING_HOURS.lunchEnd * 60) {
        result.setUTCHours(WORKING_HOURS.lunchEnd, 0, 0, 0);
        continue;
      }

      // Calcular minutos disponibles hasta el fin del día laboral o inicio del almuerzo
      let availableMinutes: number;

      if (currentTimeInMinutes < WORKING_HOURS.lunchStart * 60) {
        // Antes del almuerzo
        availableMinutes = (WORKING_HOURS.lunchStart * 60) - currentTimeInMinutes;
      } else {
        // Después del almuerzo
        availableMinutes = (WORKING_HOURS.endHour * 60) - currentTimeInMinutes;
      }

      if (remainingMinutes <= availableMinutes) {
        // Podemos sumar todo el tiempo restante
        result.setUTCMinutes(result.getUTCMinutes() + remainingMinutes);
        remainingMinutes = 0;
      } else {
        // Necesitamos más tiempo, avanzar al siguiente segmento
        if (currentTimeInMinutes < WORKING_HOURS.lunchStart * 60) {
          // Saltar al inicio de la tarde (1:00 PM)
          result.setUTCHours(WORKING_HOURS.lunchEnd, 0, 0, 0);
          remainingMinutes -= availableMinutes;
        } else {
          // Saltar al siguiente día laboral a las 8:00 AM
          result = this.getNextWorkingDay(result);
          result.setUTCHours(WORKING_HOURS.startHour, 0, 0, 0);
          remainingMinutes -= availableMinutes;
        }
      }
    }

    return result;
  }

  /**
   * Calcula la fecha resultante sumando días y/o horas hábiles
   */
  async calculate(
    startDateUTC: Date | null,
    days: number | undefined,
    hours: number | undefined
  ): Promise<Date> {
    // Asegurar que los festivos estén cargados
    await holidaysService.fetchHolidays();

    // Determinar la fecha de inicio en hora de Colombia
    let currentDate: Date;

    if (startDateUTC) {
      currentDate = this.toColombiaTime(startDateUTC);
    } else {
      // Usar hora actual en Colombia
      const now = new Date();
      currentDate = this.toColombiaTime(now);
    }

    // Normalizar al horario laboral más cercano (hacia atrás)
    currentDate = this.normalizeToWorkingTime(currentDate);

    // Sumar días hábiles si se especificaron
    if (days && days > 0) {
      currentDate = this.addWorkingDays(currentDate, days);
    }

    // Sumar horas hábiles si se especificaron
    if (hours && hours > 0) {
      currentDate = this.addWorkingHours(currentDate, hours);
    }

    // Convertir el resultado a UTC
    return this.toUTC(currentDate);
  }
}

export const workingDaysCalculator = new WorkingDaysCalculator();
