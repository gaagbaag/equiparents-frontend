#!/bin/bash

echo "🔧 Iniciando configuración del proyecto Equi·Parents..."

# Verificar si pnpm está instalado
if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm no está instalado. Instálalo con:"
  echo "   npm install -g pnpm"
  exit 1
fi

# Verificar que exista .env.local
if [ ! -f .env.local ]; then
  echo "⚠️  Archivo .env.local no encontrado."
  echo "   Crea uno a partir de .env.example si está disponible:"
  echo "   cp .env.example .env.local"
  exit 1
fi

# Verificar que las variables críticas estén definidas en .env.local
required_vars=(
  AUTH0_SECRET
  AUTH0_BASE_URL
  AUTH0_ISSUER_BASE_URL
  AUTH0_CLIENT_ID
  AUTH0_CLIENT_SECRET
  NEXT_PUBLIC_API_URL
)

echo "🔍 Validando variables necesarias en .env.local..."
for var in "${required_vars[@]}"; do
  if ! grep -q "^$var=" .env.local; then
    echo "❌ Falta la variable: $var en .env.local"
    missing_vars=true
  fi
done

if [ "$missing_vars" = true ]; then
  echo ""
  echo "🛑 Corrige las variables faltantes en .env.local antes de continuar."
  exit 1
fi

# Limpiar dependencias anteriores
echo "🧹 Limpiando dependencias anteriores..."
rm -rf node_modules pnpm-lock.yaml

# Instalar dependencias con pnpm
echo "📦 Instalando dependencias..."
pnpm install

# Aprobar scripts de construcción como prisma, sharp
echo "✅ Aprobando scripts seguros..."
echo "🔐 Por favor ejecuta manualmente: pnpm approve-builds"
echo "   y aprueba: prisma, @prisma/engines, esbuild"

echo ""
echo "✅ Proyecto Equi·Parents listo para usar."
echo "🚀 Ejecuta: pnpm dev"
