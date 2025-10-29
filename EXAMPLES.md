# Ejemplos de Uso de la API

Este documento contiene ejemplos prácticos de cómo usar la API de días hábiles.

## Ejemplos Básicos

### 1. Sumar horas desde una fecha específica

```bash
# Viernes 5:00 PM + 1 hora = Lunes 9:00 AM
curl "http://localhost:3000/calculate?hours=1&date=2025-01-24T22:00:00.000Z"
```

**Respuesta:**
```json
{
  "date": "2025-01-27T14:00:00.000Z"
}
```

### 2. Sumar días y horas

```bash
# Martes 3:00 PM + 1 día + 4 horas = Jueves 10:00 AM
curl "http://localhost:3000/calculate?days=1&hours=4&date=2025-01-21T20:00:00.000Z"
```

**Respuesta:**
```json
{
  "date": "2025-01-23T15:00:00.000Z"
}
```

### 3. Usar hora actual como punto de partida

```bash
# Sumar 2 días hábiles desde ahora
curl "http://localhost:3000/calculate?days=2"
```

### 4. Jornada laboral completa (8 horas)

```bash
# Lunes 8:00 AM + 8 horas = Lunes 5:00 PM
curl "http://localhost:3000/calculate?hours=8&date=2025-01-20T13:00:00.000Z"
```

**Respuesta:**
```json
{
  "date": "2025-01-20T22:00:00.000Z"
}
```

### 5. Atravesar horario de almuerzo

```bash
# Lunes 11:30 AM + 3 horas = Lunes 3:30 PM (saltando almuerzo)
curl "http://localhost:3000/calculate?hours=3&date=2025-01-20T16:30:00.000Z"
```

**Respuesta:**
```json
{
  "date": "2025-01-20T20:30:00.000Z"
}
```

### 6. Normalización durante almuerzo

```bash
# Lunes 12:30 PM (durante almuerzo) + 1 día = Martes 12:00 PM
curl "http://localhost:3000/calculate?days=1&date=2025-01-20T17:30:00.000Z"
```

**Respuesta:**
```json
{
  "date": "2025-01-21T17:00:00.000Z"
}
```

## Ejemplos con Festivos

### 7. Atravesando días festivos

```bash
# 10 abril 10:00 AM + 5 días + 4 horas (saltando festivos 17-18 abril) = 21 abril 3:00 PM
curl "http://localhost:3000/calculate?days=5&hours=4&date=2025-04-10T15:00:00.000Z"
```

**Respuesta:**
```json
{
  "date": "2025-04-21T20:00:00.000Z"
}
```

## Ejemplos de Normalización

### 8. Normalización desde fin de semana

```bash
# Sábado 2:00 PM + 1 hora = Lunes 9:00 AM (normaliza a viernes 5 PM, luego suma)
curl "http://localhost:3000/calculate?hours=1&date=2025-01-25T19:00:00.000Z"
```

**Respuesta:**
```json
{
  "date": "2025-01-27T14:00:00.000Z"
}
```

### 9. Normalización desde domingo

```bash
# Domingo 6:00 PM + 1 día = Martes 5:00 PM
curl "http://localhost:3000/calculate?days=1&date=2025-01-26T23:00:00.000Z"
```

**Respuesta:**
```json
{
  "date": "2025-01-27T22:00:00.000Z"
}
```

## Ejemplos de Errores

### 10. Sin parámetros

```bash
curl "http://localhost:3000/calculate"
```

**Respuesta (400):**
```json
{
  "error": "InvalidParameters",
  "message": "At least one of \"days\" or \"hours\" parameters must be provided"
}
```

### 11. Parámetro negativo

```bash
curl "http://localhost:3000/calculate?hours=-1"
```

**Respuesta (400):**
```json
{
  "error": "InvalidParameters",
  "message": "Parameter \"hours\" must be a positive integer"
}
```

### 12. Fecha inválida

```bash
curl "http://localhost:3000/calculate?hours=1&date=invalid-date"
```

**Respuesta (400):**
```json
{
  "error": "InvalidParameters",
  "message": "Parameter \"date\" is not a valid date"
}
```

### 13. Fecha sin sufijo Z

```bash
curl "http://localhost:3000/calculate?hours=1&date=2025-01-20T13:00:00"
```

**Respuesta (400):**
```json
{
  "error": "InvalidParameters",
  "message": "Parameter \"date\" must be in ISO 8601 format with Z suffix"
}
```

## Conversión de Zonas Horarias

Para convertir de hora de Colombia a UTC:
- Colombia (COL): UTC-5
- Formula: UTC = COL + 5 horas

Ejemplos:
- 08:00 COL = 13:00 UTC (8 AM Colombia = 1 PM UTC)
- 17:00 COL = 22:00 UTC (5 PM Colombia = 10 PM UTC)
- 12:00 COL = 17:00 UTC (12 PM Colombia = 5 PM UTC)

## Testing con diferentes herramientas

### Con curl
```bash
curl "http://localhost:3000/calculate?hours=1&date=2025-01-24T22:00:00.000Z"
```

### Con httpie
```bash
http GET "http://localhost:3000/calculate" hours==1 date=="2025-01-24T22:00:00.000Z"
```

### Con JavaScript/Fetch
```javascript
fetch('http://localhost:3000/calculate?hours=1&date=2025-01-24T22:00:00.000Z')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Con Python/Requests
```python
import requests

response = requests.get(
    'http://localhost:3000/calculate',
    params={'hours': 1, 'date': '2025-01-24T22:00:00.000Z'}
)
print(response.json())
```
