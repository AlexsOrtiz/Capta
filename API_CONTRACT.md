# Contrato de la API - Especificación Técnica

## Endpoint

```
GET /calculate
```

## Parámetros de Query String

| Parámetro | Tipo | Requerido | Validación | Descripción |
|-----------|------|-----------|------------|-------------|
| `days` | integer | No* | ≥ 0, entero | Número de días hábiles a sumar |
| `hours` | integer | No* | ≥ 0, entero | Número de horas hábiles a sumar |
| `date` | string | No | ISO 8601 con Z | Fecha/hora inicial en UTC |

\* Al menos uno de `days` o `hours` debe estar presente

## Respuestas

### Éxito (200 OK)

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "date": "2025-08-01T14:00:00.000Z"
}
```

**Estructura:**
- Campo obligatorio: `date` (string, ISO 8601 con Z en UTC)
- No debe contener campos adicionales
- La fecha siempre termina con `.000Z`

### Error de Parámetros (400 Bad Request)

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "error": "InvalidParameters",
  "message": "Descripción específica del error"
}
```

**Casos de error 400:**
1. No se proporciona `days` ni `hours`
2. `days` no es un entero positivo
3. `hours` no es un entero positivo
4. `date` no está en formato ISO 8601 con Z
5. `date` no es una fecha válida

### Error del Servidor (503 Service Unavailable)

**Body:**
```json
{
  "error": "InternalServerError",
  "message": "Descripción del error interno"
}
```

**Casos de error 503:**
- Fallo al obtener datos de festivos
- Errores inesperados durante el cálculo

## Reglas de Negocio Implementadas

### 1. Horario Laboral
- **Inicio:** 8:00 AM (hora de Colombia)
- **Fin:** 5:00 PM (hora de Colombia)
- **Almuerzo:** 12:00 PM - 1:00 PM (no cuenta como tiempo laboral)

### 2. Días Laborales
- Lunes a viernes únicamente
- Excluye sábados y domingos
- Excluye festivos colombianos

### 3. Normalización (hacia atrás)
La fecha de inicio se ajusta al último momento laboral válido si:
- Es fin de semana
- Es festivo
- Está antes de las 8:00 AM
- Está durante el almuerzo (12:00 PM - 1:00 PM)
- Está después de las 5:00 PM

**Ejemplos de normalización:**
- Sábado 2:00 PM → Viernes 5:00 PM
- Lunes 7:00 AM → Viernes 5:00 PM (día anterior)
- Lunes 12:30 PM → Lunes 12:00 PM
- Lunes 6:00 PM → Lunes 5:00 PM

### 4. Cálculo de Días Hábiles
- Suma el número especificado de días laborales completos
- Mantiene la hora del día normalizada
- Salta fines de semana y festivos

**Ejemplo:**
- Lunes 8:00 AM + 1 día = Martes 8:00 AM
- Viernes 3:00 PM + 1 día = Lunes 3:00 PM

### 5. Cálculo de Horas Hábiles
- Solo cuenta horas dentro del horario laboral
- Excluye la hora de almuerzo (12:00 PM - 1:00 PM)
- Si se agotan las horas del día, continúa en el siguiente día laboral

**Ejemplo:**
- Lunes 11:00 AM + 3 horas = Lunes 3:00 PM (salta almuerzo)
- Lunes 4:00 PM + 2 horas = Martes 9:00 AM

### 6. Orden de Ejecución
1. Convertir fecha UTC a hora de Colombia (o usar hora actual si no se provee)
2. Normalizar al horario laboral válido más cercano (hacia atrás)
3. Sumar días hábiles (si se especificaron)
4. Sumar horas hábiles (si se especificaron)
5. Convertir resultado de hora de Colombia a UTC

### 7. Zona Horaria
- **Entrada:** UTC (si se provee `date`)
- **Cálculos internos:** Hora de Colombia (UTC-5)
- **Salida:** UTC

**Conversión:**
- Colombia = UTC - 5 horas
- UTC = Colombia + 5 horas

## Ejemplos de Validación Automática

### Formato de Respuesta Exitosa
✅ Válido:
```json
{"date": "2025-08-01T14:00:00.000Z"}
```

❌ Inválido (campo extra):
```json
{"date": "2025-08-01T14:00:00.000Z", "info": "extra"}
```

❌ Inválido (sin Z):
```json
{"date": "2025-08-01T14:00:00"}
```

❌ Inválido (nombre incorrecto):
```json
{"result": "2025-08-01T14:00:00.000Z"}
```

### Nombres de Parámetros
✅ Válido:
```
?days=1&hours=2
```

❌ Inválido:
```
?day=1&hour=2
?Days=1&Hours=2
```

### Content-Type
✅ Válido:
```
Content-Type: application/json
```

❌ Inválido:
```
Content-Type: text/plain
Content-Type: application/xml
```

### Códigos de Estado HTTP
✅ Correcto:
- 200 para éxito
- 400 para parámetros inválidos
- 503 para errores del servidor
- 404 para rutas no encontradas

❌ Incorrecto:
- 500 en lugar de 503
- 422 en lugar de 400
- 201 en lugar de 200

## Festivos Colombianos

Fuente de datos:
```
https://content.capta.co/Recruitment/WorkingDays.json
```

**Formato esperado:**
```json
[
  "2025-01-01",
  "2025-01-06",
  "2025-03-24",
  ...
]
```

**Características:**
- Cache de 24 horas para optimizar rendimiento
- Se refresca automáticamente después de expirar
- Incluye festivos desde 2025 hasta 2035

## Notas de Implementación

1. **TypeScript:** Todo el código debe tener tipado explícito
2. **Precisión:** Los cálculos deben ser exactos al minuto
3. **Performance:** Optimizado para complejidad O(n) donde n es el número de días/horas
4. **Robustez:** Manejo completo de casos límite y errores
5. **Zona horaria:** Uso consistente de métodos UTC en objetos Date
