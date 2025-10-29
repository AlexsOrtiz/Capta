# API de Días Hábiles - Colombia

API REST desarrollada en TypeScript que calcula fechas hábiles en Colombia, teniendo en cuenta:

- Días festivos nacionales colombianos
- Horarios laborales (lunes a viernes, 8:00 AM - 5:00 PM, con almuerzo de 12:00 PM - 1:00 PM)
- Zona horaria de Colombia (America/Bogota, UTC-5)
- Conversión automática entre hora local de Colombia y UTC

## 📋 Requisitos

- Node.js 18 o superior
- npm o yarn

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone <URL_DEL_REPOSITORIO>
cd Capta
```

2. Instalar dependencias:
```bash
npm install
```

3. Compilar el proyecto TypeScript:
```bash
npm run build
```

## 💻 Ejecución Local

### Modo Desarrollo (con TypeScript)
```bash
npm run dev
```

### Modo Producción
```bash
npm run build
npm start
```

El servidor se ejecutará en `http://localhost:3000` por defecto.

## 🧪 Pruebas

Para ejecutar el script de pruebas con los 9 casos de ejemplo:

```bash
npm test
```

## 📡 Uso de la API

### Endpoint Principal

```
GET /calculate
```

### Parámetros (Query String)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `days` | integer | No* | Número de días hábiles a sumar (entero positivo) |
| `hours` | integer | No* | Número de horas hábiles a sumar (entero positivo) |
| `date` | string | No | Fecha/hora inicial en UTC formato ISO 8601 con sufijo Z. Si no se proporciona, se usa la hora actual en Colombia |

\* Al menos uno de `days` o `hours` debe estar presente

### Respuesta Exitosa (200 OK)

```json
{
  "date": "2025-08-01T14:00:00Z"
}
```

### Respuesta de Error (400, 503)

```json
{
  "error": "InvalidParameters",
  "message": "Detalle del error"
}
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Sumar 1 hora desde un viernes a las 5:00 PM
```bash
curl "http://localhost:3000/calculate?hours=1&date=2025-01-24T22:00:00Z"
```

Resultado esperado: Lunes 9:00 AM Colombia (14:00:00Z UTC)

### Ejemplo 2: Sumar 1 día desde la hora actual
```bash
curl "http://localhost:3000/calculate?days=1"
```

### Ejemplo 3: Sumar 1 día y 4 horas desde una fecha específica
```bash
curl "http://localhost:3000/calculate?days=1&hours=4&date=2025-01-21T20:00:00Z"
```

### Ejemplo 4: Caso con festivos (17-18 abril)
```bash
curl "http://localhost:3000/calculate?days=5&hours=4&date=2025-04-10T15:00:00Z"
```

## 🏗️ Estructura del Proyecto

```
Capta/
├── src/
│   ├── index.ts                    # Servidor Express y endpoints
│   ├── types.ts                    # Tipos e interfaces TypeScript
│   ├── holidaysService.ts          # Servicio de días festivos
│   ├── workingDaysCalculator.ts    # Lógica de cálculo de días/horas hábiles
│   └── test.ts                     # Script de pruebas
├── dist/                           # Código compilado (generado)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Reglas de Negocio

1. **Días laborales**: Lunes a viernes, excluyendo festivos colombianos
2. **Horario laboral**: 8:00 AM - 5:00 PM (hora de Colombia)
3. **Hora de almuerzo**: 12:00 PM - 1:00 PM (no cuenta como tiempo laboral)
4. **Normalización**: Si la fecha de inicio está fuera de horario laboral o en día no laboral, se ajusta hacia atrás al último momento laboral válido
5. **Festivos**: Se obtienen dinámicamente desde https://content.capta.co/Recruitment/WorkingDays.json
6. **Zona horaria**: Todos los cálculos se hacen en hora de Colombia (UTC-5), la respuesta se convierte a UTC

## 🌐 Despliegue

### Variables de Entorno

```bash
PORT=3000  # Puerto del servidor (opcional, default: 3000)
```

### Despliegue en Servicios Cloud

#### Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel
```

#### Railway
```bash
# Conectar el repositorio en railway.app
# Railway detectará automáticamente Node.js y ejecutará:
# Build: npm run build
# Start: npm start
```

#### Render
```bash
# En render.com, configurar:
# Build Command: npm install && npm run build
# Start Command: npm start
# Environment: Node
```

#### Heroku
```bash
# Instalar Heroku CLI y ejecutar
heroku create
git push heroku main
```

La aplicación incluye configuración lista para:
- **Vercel**: `vercel.json` incluido
- **Railway/Heroku**: `Procfile` incluido
- **Render**: Compatible con auto-detección de Node.js

## 📚 Tecnologías Utilizadas

- **TypeScript**: Tipado estático y seguridad de tipos
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web minimalista
- **Fetch API**: Cliente HTTP para obtener festivos

## 🤝 Desarrollo

### Comandos Disponibles

```bash
npm run dev      # Ejecutar en modo desarrollo
npm run build    # Compilar TypeScript a JavaScript
npm start        # Ejecutar versión compilada
npm test         # Ejecutar pruebas
```

## 📄 Licencia

MIT

## ✨ Características Principales

- ✅ 100% TypeScript con tipado explícito
- ✅ Validación exhaustiva de parámetros
- ✅ Manejo correcto de zonas horarias
- ✅ Cache de festivos (24 horas)
- ✅ Respuestas en formato estándar
- ✅ Códigos HTTP correctos
- ✅ Modular y mantenible
- ✅ Optimizado para rendimiento
