# Packaging API

API para otimização de empacotamento de produtos em caixas de papelão, desenvolvida com NestJS.

## 📋 Descrição

Esta API foi desenvolvida para automatizar o processo de embalagem de pedidos. A API recebe uma lista de pedidos com produtos e suas dimensões, e retorna a melhor forma de empacotá-los usando as caixas de papelão disponíveis.

## 🎯 Funcionalidades

- ✅ Processamento de pedidos com múltiplos produtos
- ✅ Algoritmo de otimização de empacotamento (First Fit Decreasing)
- ✅ Suporte a rotação de produtos para melhor aproveitamento do espaço
- ✅ Cálculo de utilização de volume das caixas
- ✅ Documentação completa com Swagger/OpenAPI
- ✅ Testes unitários e de integração
- ✅ Containerização com Docker
- ✅ Validação de dados de entrada

## 📦 Caixas Disponíveis

| Tipo | Dimensões (A x L x C) | Volume |
|------|----------------------|--------|
| Caixa 1 | 30 x 40 x 80 cm | 96.000 cm³ |
| Caixa 2 | 50 x 50 x 40 cm | 100.000 cm³ |
| Caixa 3 | 50 x 80 x 60 cm | 240.000 cm³ |

## 🚀 Como Executar

### Pré-requisitos

- pnpm (ou npm/yarn)
- Docker (opcional)

### Instalação Local

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd packaging-api
```

2. Instale as dependências:
```bash
pnpm install
```

3. Execute a aplicação:
```bash
# Desenvolvimento
pnpm run start:dev

# Produção
pnpm run build
pnpm run start:prod
```

### Docker Compose

```bash
# Iniciar todos os serviços (API + Telemetria)
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Parar todos os serviços
docker-compose down
```

### 📊 Telemetria e Monitoramento

A API inclui telemetria completa com OpenTelemetry e dashboard Aspire:

#### 🚀 Iniciando com Telemetria

1. **Configure as variáveis de ambiente** (crie um arquivo `.env`):
```env
# API Configuration
API_KEY=sua_chave_secreta_aqui
PORT=3000
NODE_ENV=development

# OpenTelemetry Configuration
OTEL_SERVICE_NAME=packaging_api
OTEL_SERVICE_VERSION=1.0.0
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:18889/v1/traces
OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://localhost:18889/v1/metrics
OTEL_RESOURCE_ATTRIBUTES=service.name=packaging_api,service.version=1.0.0
```

2. **Inicie os serviços**:
```bash
docker-compose up -d --build
```

3. **Acesse os serviços**:
   - **API**: http://localhost:3000
   - **Swagger**: http://localhost:3000/docs
   - **Aspire Dashboard**: http://localhost:18888

#### 📈 Painel do Aspire Dashboard

Para encontrar a chave de acesso é necessário buscar nos logs ou executar o seguinte comando:
```bash
docker logs packaging-telemetry 2>&1 | grep -o "http://localhost:18888/login?t=[a-z0-9]*"
```

O Aspire Dashboard oferece visibilidade completa da aplicação:

**1. Visão Geral dos Serviços**
- Lista todos os serviços conectados
- Status de saúde em tempo real
- Métricas de performance

**2. Traces e Logs**
- Rastreamento de requisições HTTP
- Logs estruturados com contexto
- Análise de performance por endpoint

**3. Métricas de Performance**
- Tempo de resposta das requisições
- Taxa de erro por endpoint
- Throughput de requisições

**4. Navegação no Dashboard**
```
📊 Aspire Dashboard (http://localhost:18888)
├── 🏠 Overview - Visão geral dos serviços
├── 📈 Metrics - Métricas de performance
├── 🔍 Traces - Rastreamento de requisições
├── 📝 Logs - Logs estruturados
└── ⚙️ Settings - Configurações
```

**5. Recursos Monitorados**
- ✅ **Requisições HTTP**: Todas as chamadas para a API
- ✅ **Tempo de resposta**: Latência por endpoint
- ✅ **Erros e exceções**: Falhas e stack traces
- ✅ **Métricas de performance**: CPU, memória, throughput
- ✅ **Traces distribuídos**: Fluxo completo das requisições
- ✅ **Logs estruturados**: Com contexto e request ID

#### 📝 Logs Estruturados

A API utiliza logs estruturados com Pino para melhor observabilidade:

**Níveis de Log:**
- `ERROR`: Erros críticos e exceções
- `WARN`: Avisos e situações anômalas
- `INFO`: Informações importantes do fluxo
- `DEBUG`: Detalhes técnicos para debugging

**Contexto dos Logs:**
- **Request ID**: Identificador único por requisição
- **User Agent**: Informações do cliente
- **Timestamp**: Data/hora precisa
- **Service**: Nome do serviço (packaging-api)

**Exemplos de Logs:**
```json
{
  "level": 30,
  "time": 1640995200000,
  "pid": 1234,
  "hostname": "packaging-api",
  "requestId": "req-123456",
  "msg": "Iniciando processamento de 2 pedido(s)",
  "service": "PackagingService"
}
```

**Visualizando Logs:**
```bash
# Logs em tempo real
docker-compose logs -f packaging-api

# Logs com filtro de nível
docker-compose logs packaging-api | grep "ERROR"

# Logs estruturados (JSON)
docker-compose logs packaging-api | jq '.'
```

#### 🔧 Troubleshooting da Telemetria

**Se o serviço não aparecer no Aspire:**

1. **Verifique se os containers estão rodando**:
```bash
docker-compose ps
```

2. **Verifique os logs da API**:
```bash
docker-compose logs packaging-api
```

3. **Verifique os logs do Aspire**:
```bash
docker-compose logs telemetry
```

4. **Teste a conectividade**:
```bash
# Teste se a API está respondendo
curl http://localhost:3000/packaging/health

# Teste se o Aspire está acessível
curl http://localhost:18888
```

**Problemas comuns:**
- **Porta 18888 ocupada**: Mude a porta no `docker-compose.yml`
- **API não aparece**: Verifique se as variáveis `OTEL_*` estão configuradas
- **Logs não aparecem**: Verifique se o nível de log está configurado corretamente

#### 🧪 Testando a Telemetria

Use o script de teste incluído para gerar dados de telemetria:

```bash
# Execute o script de teste
./test-telemetry.sh
```

Este script irá:
1. Iniciar os containers
2. Fazer requisições de teste para a API
3. Gerar traces e métricas no Aspire
4. Mostrar os URLs de acesso

**Teste manual:**
```bash
# Health check
curl -X POST http://localhost:3000/packaging/health \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua_chave_secreta_aqui"

# Teste de empacotamento
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
  }'
```

## 📚 Documentação da API

Após iniciar a aplicação, acesse a documentação Swagger em:
- **Desenvolvimento**: http://localhost:3000/docs

## 🔐 Autenticação

A API utiliza autenticação por API Key. Para usar os endpoints protegidos:

1. Configure a variável `API_KEY` no arquivo `.env`:
```env
API_KEY=sua_chave_secreta_aqui
```

2. Use a API Key configurada no header `X-API-Key: <api-key>`

### Configuração

Crie um arquivo `.env` na raiz do projeto com:
```env
# API Configuration
API_KEY=sua_chave_secreta_aqui
PORT=3000
NODE_ENV=development

# OpenTelemetry Configuration (para Aspire Dashboard)
OTEL_SERVICE_NAME=packaging-api
OTEL_SERVICE_VERSION=1.0.0
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:18889/v1/traces
OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://localhost:18889/v1/metrics
OTEL_RESOURCE_ATTRIBUTES=service.name=packaging-api,service.version=1.0.0
```

## 📝 Exemplos de Uso

### Exemplo de Entrada

```json
{
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
        },
        {
          "produto_id": "Volante",
          "dimensoes": {
            "altura": 40,
            "largura": 30,
            "comprimento": 30
          }
        }
      ]
    }
  ]
}
```

### Exemplo de Saída

```json
{
  "pedidos": [
		{
			"pedido_id": 1,
			"caixas": [
				{
					"caixa_id": "Caixa 1",
					"produtos": [
						"Volante",
						"PS5"
					]
				}
			]
		}
}
```

## 🧪 Testes

Execute os testes com:

```bash
# Testes unitários
pnpm run test

# Testes e2e
pnpm run test:e2e

# Cobertura de testes
pnpm run test:cov
```

## 📊 Endpoints

### POST /packaging/process
Processa pedidos e determina o melhor empacotamento.

**Headers:**
- `Authorization: Bearer <token>` (opcional)

**Body:** `PackagingRequestDto`

**Response:** `PackagingResponseDto`

### POST /packaging/health
Verifica a saúde da API.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "packaging-api"
}
```


## 🔧 Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| API_KEY | Chave de autenticação da API | Obrigatória |
| PORT | Porta da aplicação | 3000 |
| NODE_ENV | Ambiente de execução | development |

### Exemplo de .env

```env
API_KEY=sua_chave_secreta_aqui
PORT=3000
NODE_ENV=production
```

## 🏗️ Arquitetura

```
src/
├── auth/                 # Módulo de autenticação
│   ├── api-key.strategy.ts
│   ├── api-key-auth.guard.ts
│   ├── auth.module.ts
│   └── public.decorator.ts
├── packaging/            # Módulo de empacotamento
│   ├── dto/
│   │   ├── order.dto.ts
│   │   ├── product.dto.ts
│   │   ├── packaging-request.dto.ts
│   │   └── packaging-response.dto.ts
│   ├── interfaces/
│   │   └── packaging.interface.ts
│   ├── packaging.controller.ts
│   ├── packaging.service.ts
│   ├── packaging.service.spec.ts
│   └── packaging.module.ts
├── logger/               # Módulo de logging
│   ├── logger.service.ts # Configuração do Pino logger
│   └── logger.module.ts  # Módulo de configuração de logs
├── telemetry.ts          # Configuração de telemetria OpenTelemetry
├── app.module.ts         # Módulo principal
└── main.ts              # Ponto de entrada
```

### 📁 Descrição dos Módulos

**🔐 Auth Module (`src/auth/`)**
- **api-key.strategy.ts**: Estratégia de autenticação por API Key
- **api-key-auth.guard.ts**: Guard para proteção de rotas
- **auth.module.ts**: Configuração do módulo de autenticação
- **public.decorator.ts**: Decorator para marcar rotas públicas

**📦 Packaging Module (`src/packaging/`)**
- **dto/**: Data Transfer Objects para validação de entrada/saída
- **interfaces/**: Interfaces TypeScript para tipagem
- **packaging.controller.ts**: Controller REST com endpoints
- **packaging.service.ts**: Lógica de negócio do empacotamento
- **packaging.module.ts**: Configuração do módulo

**📝 Logger Module (`src/logger/`)**
- **logger.service.ts**: Configuração do Pino logger com níveis e serializers
- **logger.module.ts**: Módulo de configuração de logging

**📊 Telemetria (`src/telemetry.ts`)**
- Configuração do OpenTelemetry para traces e métricas
- Integração com Aspire Dashboard
- Instrumentação automática de HTTP, Express e NestJS

**🏠 App Module (`src/app.module.ts`)**
- Módulo raiz da aplicação
- Configuração global de guards e interceptors
- Importação de todos os módulos

**🚀 Main (`src/main.ts`)**
- Ponto de entrada da aplicação
- Configuração do Swagger/OpenAPI
- Configuração de CORS e validação global

## 🧮 Algoritmo de Empacotamento

A API utiliza um algoritmo de **empacotamento otimizado** para maximizar o aproveitamento das caixas:

1. **Loop principal**: Repete até empacotar todos os produtos
2. **Para cada iteração**:
   - **Ordenação de caixas**: Caixas são ordenadas por volume (menor primeiro)
   - **Para cada caixa**:
     - **Ordenação de produtos**: Produtos são ordenados por volume (maior primeiro)
     - **Rotação**: Cada produto é testado em 6 orientações diferentes
     - **Empacotamento**: Tenta colocar o máximo de produtos possível nesta caixa
   - **Seleção da melhor combinação**: Escolhe a caixa que comportou mais produtos
   - **Critério de desempate**: Em caso de empate, escolhe a caixa de menor volume
3. **Empacotamento**: Coloca os produtos selecionados na caixa escolhida
4. **Remoção**: Remove os produtos empacotados da lista de produtos restantes
5. **Fallback**: Produtos que não cabem em caixas padrão recebem observação especial

### 🔄 Como funciona na prática:

1. **Início**: Pega todos os produtos do pedido
2. **Para cada iteração** (até empacotar todos):
   - **Ordena caixas** por volume (menor primeiro)
   - **Para cada caixa**:
     - **Ordena produtos** por volume (maior primeiro)
     - **Testa cada produto** em 6 orientações
     - **Conta quantos produtos** couberam nesta caixa
   - **Escolhe a caixa** que comportou mais produtos
   - **Empacota** os produtos na caixa escolhida
   - **Remove** os produtos empacotados da lista
3. **Repetição**: Volta ao passo 2 até não restarem produtos

### 🎯 Vantagens do algoritmo:

- **Maximiza aproveitamento**: Sempre escolhe a combinação que empacota mais produtos
- **Minimiza desperdício**: Em caso de empate, escolhe a caixa menor
- **Flexibilidade**: Testa todas as orientações possíveis dos produtos
- **Robustez**: Lida com produtos que não cabem em nenhuma caixa

## 📈 Performance

- **Complexidade**: O(n²) onde n é o número de produtos
  - Ordenação de produtos: O(n log n)
  - Algoritmo de empacotamento: O(n²) - testa todas as caixas para cada iteração
- **Memória**: O(n) onde n é o número de produtos
- **Tempo real medido**:
  - Até 25 produtos: ~0.4ms
  - Até 50 produtos: ~0.3ms  
  - Até 100 produtos: ~0.6ms
  - Até 200 produtos: ~1.6ms
  - **Performance excelente**: Sub-milissegundo para a maioria dos casos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🧐 Observação

Notei um erro na saida do pedido 01 no exemplo passado. O pedido cabe tranquilamente na caixa 1, como é possível ver nesse exemplo feito com  [Geogebra](https://www.geogebra.org/3d/kbecvjyk)

---

**Nota**: Esta API foi desenvolvida como solução para o teste técnico de criação de uma API de empacotamento. Para uso em produção, considere implementar persistência de dados, logs estruturados, monitoramento e outras práticas de DevOps.