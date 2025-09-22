#!/bin/bash

echo "🚀 Iniciando teste de telemetria..."

# Inicia os serviços
echo "📦 Iniciando containers..."
docker-compose up -d

# Aguarda os serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Testa a API
echo "🧪 Testando API..."
curl -X POST http://localhost:3000/packaging/health \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua_chave_secreta_aqui" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

# Testa endpoint de empacotamento
echo "📦 Testando empacotamento..."
curl -X POST http://localhost:3000/packaging/process \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua_chave_secreta_aqui" \
  -d '{
    "pedidos": [
      {
        "pedido_id": 1,
        "produtos": [
          {
            "produto_id": "PS5",
            "dimensoes": {
              "altura": 40,
              "largura": 10,
              "comprimento": 25
            }
          }
        ]
      }
    ]
  }' \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "📊 Telemetria configurada!"
echo "🌐 Dashboard Aspire: http://localhost:18888"
echo "🔍 API Swagger: http://localhost:3000/api"
echo ""
echo "Para parar os serviços: docker-compose down"
