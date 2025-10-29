import express, { Request, Response } from 'express';
import { WorkingDaysRequest, WorkingDaysResponse, ErrorResponse } from './types';
import { workingDaysCalculator } from './workingDaysCalculator';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * Valida los parámetros de la petición
 */
function validateRequest(query: any): { valid: boolean; error?: ErrorResponse } {
  const { days, hours, date } = query;

  // Al menos uno de days o hours debe estar presente
  if (days === undefined && hours === undefined) {
    return {
      valid: false,
      error: {
        error: 'InvalidParameters',
        message: 'At least one of "days" or "hours" parameters must be provided'
      }
    };
  }

  // Validar days
  if (days !== undefined) {
    const daysNum = Number(days);
    if (isNaN(daysNum) || daysNum < 0 || !Number.isInteger(daysNum)) {
      return {
        valid: false,
        error: {
          error: 'InvalidParameters',
          message: 'Parameter "days" must be a positive integer'
        }
      };
    }
  }

  // Validar hours
  if (hours !== undefined) {
    const hoursNum = Number(hours);
    if (isNaN(hoursNum) || hoursNum < 0 || !Number.isInteger(hoursNum)) {
      return {
        valid: false,
        error: {
          error: 'InvalidParameters',
          message: 'Parameter "hours" must be a positive integer'
        }
      };
    }
  }

  // Validar date (debe ser ISO 8601 con Z)
  if (date !== undefined) {
    if (typeof date !== 'string' || !date.endsWith('Z')) {
      return {
        valid: false,
        error: {
          error: 'InvalidParameters',
          message: 'Parameter "date" must be in ISO 8601 format with Z suffix'
        }
      };
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return {
        valid: false,
        error: {
          error: 'InvalidParameters',
          message: 'Parameter "date" is not a valid date'
        }
      };
    }
  }

  return { valid: true };
}

/**
 * Endpoint principal
 */
app.get('/calculate', async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateRequest(req.query);

    if (!validation.valid && validation.error) {
      res.status(400).json(validation.error);
      return;
    }

    const { days, hours, date } = req.query as WorkingDaysRequest;

    const daysNum = days !== undefined ? Number(days) : undefined;
    const hoursNum = hours !== undefined ? Number(hours) : undefined;
    const startDate = date ? new Date(date) : null;

    const resultDate = await workingDaysCalculator.calculate(startDate, daysNum, hoursNum);

    const response: WorkingDaysResponse = {
      date: resultDate.toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error processing request:', error);

    const errorResponse: ErrorResponse = {
      error: 'InternalServerError',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    };

    res.status(503).json(errorResponse);
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok' });
});

/**
 * Ruta por defecto para otras peticiones
 */
app.use((_req: Request, res: Response): void => {
  res.status(404).json({
    error: 'NotFound',
    message: 'Endpoint not found. Use /calculate with query parameters days and/or hours'
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Example: http://localhost:${PORT}/calculate?days=1&hours=2`);
});

export default app;
