import { workingDaysCalculator } from './workingDaysCalculator';
import { holidaysService } from './holidaysService';

/**
 * Script de pruebas para verificar los casos de ejemplo
 */

interface TestCase {
  description: string;
  startDate: string | null;
  days?: number;
  hours?: number;
  expectedDescription: string;
}

const testCases: TestCase[] = [
  {
    description: 'Test 1: Viernes 5:00 PM + 1 hora',
    startDate: '2025-01-24T22:00:00.000Z', // Viernes 17:00 Colombia = 22:00 UTC
    hours: 1,
    expectedDescription: 'Lunes 9:00 AM Colombia (14:00 UTC)'
  },
  {
    description: 'Test 2: Sábado 2:00 PM + 1 hora',
    startDate: '2025-01-25T19:00:00.000Z', // Sábado 14:00 Colombia = 19:00 UTC
    hours: 1,
    expectedDescription: 'Lunes 9:00 AM Colombia (14:00 UTC)'
  },
  {
    description: 'Test 3: Martes 3:00 PM + 1 día + 4 horas',
    startDate: '2025-01-21T20:00:00.000Z', // Martes 15:00 Colombia = 20:00 UTC
    days: 1,
    hours: 4,
    expectedDescription: 'Jueves 10:00 AM Colombia (15:00 UTC)'
  },
  {
    description: 'Test 4: Domingo 6:00 PM + 1 día',
    startDate: '2025-01-26T23:00:00.000Z', // Domingo 18:00 Colombia = 23:00 UTC
    days: 1,
    expectedDescription: 'Martes 5:00 PM Colombia (22:00 UTC)'
  },
  {
    description: 'Test 5: Día laboral 8:00 AM + 8 horas',
    startDate: '2025-01-20T13:00:00.000Z', // Lunes 08:00 Colombia = 13:00 UTC
    hours: 8,
    expectedDescription: 'Mismo día 5:00 PM Colombia (22:00 UTC)'
  },
  {
    description: 'Test 6: Día laboral 8:00 AM + 1 día',
    startDate: '2025-01-20T13:00:00.000Z', // Lunes 08:00 Colombia = 13:00 UTC
    days: 1,
    expectedDescription: 'Martes 8:00 AM Colombia (13:00 UTC)'
  },
  {
    description: 'Test 7: Día laboral 12:30 PM + 1 día',
    startDate: '2025-01-20T17:30:00.000Z', // Lunes 12:30 Colombia = 17:30 UTC
    days: 1,
    expectedDescription: 'Martes 12:00 PM Colombia (17:00 UTC)'
  },
  {
    description: 'Test 8: Día laboral 11:30 AM + 3 horas',
    startDate: '2025-01-20T16:30:00.000Z', // Lunes 11:30 Colombia = 16:30 UTC
    hours: 3,
    expectedDescription: 'Mismo día 3:30 PM Colombia (20:30 UTC)'
  },
  {
    description: 'Test 9: 2025-04-10 10:00 AM Colombia + 5 días + 4 horas (festivos 17-18 abril)',
    startDate: '2025-04-10T15:00:00.000Z', // 10 abril 10:00 AM Colombia = 15:00 UTC
    days: 5,
    hours: 4,
    expectedDescription: '21 de abril 3:00 PM Colombia (20:00 UTC)'
  }
];

function toColombiaTime(utcDate: Date): string {
  // Colombia está en UTC-5, entonces restamos 5 horas al timestamp
  const colombiaTimestamp = utcDate.getTime() - 5 * 60 * 60 * 1000;
  const colombiaDate = new Date(colombiaTimestamp);

  // Usar métodos UTC para extraer los componentes, ya que el timestamp ya incluye el offset
  const year = colombiaDate.getUTCFullYear();
  const month = String(colombiaDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(colombiaDate.getUTCDate()).padStart(2, '0');
  const hours = String(colombiaDate.getUTCHours()).padStart(2, '0');
  const minutes = String(colombiaDate.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes} COT`;
}

async function runTests(): Promise<void> {
  console.log('='.repeat(80));
  console.log('EJECUTANDO PRUEBAS DE CASOS DE EJEMPLO');
  console.log('='.repeat(80));
  console.log();

  // Cargar festivos primero
  await holidaysService.fetchHolidays();
  console.log('Festivos cargados:', holidaysService.getAllHolidays().length);
  console.log();

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${'='.repeat(80)}`);
    console.log(`${testCase.description}`);
    console.log('-'.repeat(80));

    try {
      const startDate = testCase.startDate ? new Date(testCase.startDate) : null;

      console.log('Entrada:');
      if (startDate) {
        console.log(`  Fecha inicial (UTC): ${startDate.toISOString()}`);
        console.log(`  Fecha inicial (COL): ${toColombiaTime(startDate)}`);
      } else {
        console.log('  Fecha inicial: AHORA');
      }
      if (testCase.days) console.log(`  Días: ${testCase.days}`);
      if (testCase.hours) console.log(`  Horas: ${testCase.hours}`);

      const result = await workingDaysCalculator.calculate(
        startDate,
        testCase.days,
        testCase.hours
      );

      console.log('\nResultado:');
      console.log(`  UTC: ${result.toISOString()}`);
      console.log(`  COL: ${toColombiaTime(result)}`);
      console.log(`  Esperado: ${testCase.expectedDescription}`);

      console.log('\n✅ Test completado');
    } catch (error) {
      console.error('❌ Error en el test:', error);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('PRUEBAS COMPLETADAS');
  console.log('='.repeat(80));
}

// Ejecutar las pruebas
runTests().catch(console.error);
