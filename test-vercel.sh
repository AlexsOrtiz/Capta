#!/bin/bash

# Script para probar todos los ejemplos de la prueba técnica en Vercel
# Reemplaza con tu URL de Vercel
BASE_URL="https://capta-six.vercel.app"

echo "🧪 Probando API de Días Hábiles en Vercel"
echo "=========================================="
echo ""

echo "1️⃣ Health Check"
echo "curl $BASE_URL/health"
curl -s "$BASE_URL/health" | jq '.'
echo ""
echo ""

echo "2️⃣ Ejemplo 1: Viernes 5 PM + 1 hora → Lunes 9 AM"
echo "curl \"$BASE_URL/calculate?hours=1&date=2025-01-24T22:00:00.000Z\""
curl -s "$BASE_URL/calculate?hours=1&date=2025-01-24T22:00:00.000Z" | jq '.'
echo "Esperado: Lunes 27 enero 9:00 AM Colombia → 2025-01-27T14:00:00.000Z"
echo ""
echo ""

echo "3️⃣ Ejemplo 2: Sábado 2 PM + 1 hora → Lunes 9 AM"
echo "curl \"$BASE_URL/calculate?hours=1&date=2025-01-25T19:00:00.000Z\""
curl -s "$BASE_URL/calculate?hours=1&date=2025-01-25T19:00:00.000Z" | jq '.'
echo "Esperado: Lunes 27 enero 9:00 AM Colombia → 2025-01-27T14:00:00.000Z"
echo ""
echo ""

echo "4️⃣ Ejemplo 3: Martes 3 PM + 1 día + 4 horas → Jueves 10 AM"
echo "curl \"$BASE_URL/calculate?days=1&hours=4&date=2025-01-21T20:00:00.000Z\""
curl -s "$BASE_URL/calculate?days=1&hours=4&date=2025-01-21T20:00:00.000Z" | jq '.'
echo "Esperado: Jueves 23 enero 10:00 AM Colombia → 2025-01-23T15:00:00.000Z"
echo ""
echo ""

echo "5️⃣ Ejemplo 4: Domingo 6 PM + 1 día → Martes 5 PM"
echo "curl \"$BASE_URL/calculate?days=1&date=2025-01-26T23:00:00.000Z\""
curl -s "$BASE_URL/calculate?days=1&date=2025-01-26T23:00:00.000Z" | jq '.'
echo "Esperado: Martes 28 enero 5:00 PM Colombia → 2025-01-28T22:00:00.000Z"
echo ""
echo ""

echo "6️⃣ Ejemplo 5: Lunes 8 AM + 8 horas → Lunes 5 PM"
echo "curl \"$BASE_URL/calculate?hours=8&date=2025-01-20T13:00:00.000Z\""
curl -s "$BASE_URL/calculate?hours=8&date=2025-01-20T13:00:00.000Z" | jq '.'
echo "Esperado: Mismo día 5:00 PM Colombia → 2025-01-20T22:00:00.000Z"
echo ""
echo ""

echo "7️⃣ Ejemplo 6: Lunes 8 AM + 1 día → Martes 8 AM"
echo "curl \"$BASE_URL/calculate?days=1&date=2025-01-20T13:00:00.000Z\""
curl -s "$BASE_URL/calculate?days=1&date=2025-01-20T13:00:00.000Z" | jq '.'
echo "Esperado: Martes 21 enero 8:00 AM Colombia → 2025-01-21T13:00:00.000Z"
echo ""
echo ""

echo "8️⃣ Ejemplo 7: Lunes 12:30 PM + 1 día → Martes 12 PM"
echo "curl \"$BASE_URL/calculate?days=1&date=2025-01-20T17:30:00.000Z\""
curl -s "$BASE_URL/calculate?days=1&date=2025-01-20T17:30:00.000Z" | jq '.'
echo "Esperado: Martes 21 enero 12:00 PM Colombia → 2025-01-21T17:00:00.000Z"
echo ""
echo ""

echo "9️⃣ Ejemplo 8: Lunes 11:30 AM + 3 horas → Lunes 3:30 PM"
echo "curl \"$BASE_URL/calculate?hours=3&date=2025-01-20T16:30:00.000Z\""
curl -s "$BASE_URL/calculate?hours=3&date=2025-01-20T16:30:00.000Z" | jq '.'
echo "Esperado: Mismo día 3:30 PM Colombia → 2025-01-20T20:30:00.000Z"
echo ""
echo ""

echo "🔟 Ejemplo 9: 10 abril + 5 días + 4 horas → 21 abril 3 PM (con festivos)"
echo "curl \"$BASE_URL/calculate?days=5&hours=4&date=2025-04-10T15:00:00.000Z\""
curl -s "$BASE_URL/calculate?days=5&hours=4&date=2025-04-10T15:00:00.000Z" | jq '.'
echo "Esperado: 21 abril 3:00 PM Colombia → 2025-04-21T20:00:00.000Z"
echo ""
echo ""

echo "❌ Ejemplo ERROR 1: Sin parámetros"
echo "curl \"$BASE_URL/calculate\""
curl -s "$BASE_URL/calculate" | jq '.'
echo "Esperado: { error: 'InvalidParameters', ... }"
echo ""
echo ""

echo "❌ Ejemplo ERROR 2: Parámetro negativo"
echo "curl \"$BASE_URL/calculate?hours=-1\""
curl -s "$BASE_URL/calculate?hours=-1" | jq '.'
echo "Esperado: { error: 'InvalidParameters', ... }"
echo ""
echo ""

echo "✅ Pruebas completadas!"
