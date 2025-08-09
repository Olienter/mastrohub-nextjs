# Overnight Bootstrap Setup Guide

## 🚀 Ráno Setup - Čo treba urobiť

Tento dokument popisuje, čo treba urobiť ráno po overnight bootstrap implementácii.

## ✅ Čo už je hotové

### 1. **Infra Kostra**
- ✅ Supabase migrácie (0001_base.sql, 0002_policies.sql)
- ✅ RLS policies pre všetky tabuľky
- ✅ API endpointy (health, metrics, logs, errors, menus)
- ✅ HTTP helper s error handling
- ✅ Logger (Pino)
- ✅ Cache layer (Redis)
- ✅ PWA manifest a service worker
- ✅ Jest setup s testami
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Docker konfigurácia

### 2. **Bezpečnosť**
- ✅ Error boundary wrapper
- ✅ Zod validácia
- ✅ Request ID tracking
- ✅ Centralizované error handling

## 🔧 Čo treba urobiť ráno

### **Krok 1: Nastaviť environment variables**

Vytvorte `.env.local` súbor:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI Providers (Optional)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key-here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Monitoring
PROMETHEUS_ENABLED=true
LOG_LEVEL=info
```

### **Krok 2: Spustiť Supabase migrácie**

```bash
# V Supabase dashboard:
# 1. Choďte do SQL Editor
# 2. Spustite všetky migrácie z supabase/migrations/
# 3. Najprv 0001_base.sql, potom 0002_policies.sql
```

### **Krok 3: Nainštalovať dependencies**

```bash
npm install
```

### **Krok 4: Spustiť Redis (ak používate Docker)**

```bash
# Spustite Redis
docker run -d -p 6379:6379 redis:7-alpine

# Alebo použite docker-compose
docker-compose up -d redis
```

### **Krok 5: Otestovať aplikáciu**

```bash
# Spustite development server
npm run dev

# Otestujte endpointy
curl http://localhost:3000/api/health
curl http://localhost:3000/api/metrics
curl http://localhost:3000/api/menus
```

### **Krok 6: Spustiť testy**

```bash
# Spustite testy
npm run test

# Spustite testy s coverage
npm run test:ci
```

## 🧪 Testovanie

### **Health Check**
```bash
curl http://localhost:3000/api/health
```

Očakávaný výstup:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "0.1.0"
}
```

### **Metrics Endpoint**
```bash
curl http://localhost:3000/api/metrics
```

Očakávaný výstup (Prometheus format):
```
# HELP app_up Application status
# TYPE app_up gauge
app_up 1
```

### **Menus API**
```bash
# GET menus
curl http://localhost:3000/api/menus

# POST menu
curl -X POST http://localhost:3000/api/menus \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Menu", "description": "Test description"}'
```

## 🔍 Monitoring

### **Prometheus Metrics**
- Endpoint: `http://localhost:3000/api/metrics`
- Formát: Prometheus text format
- Metriky: app_up, http_requests_total, cache_hits_total, atď.

### **Logs**
- Logger: Pino
- Formát: JSON
- Level: info (nastaviteľné cez LOG_LEVEL)

### **Cache**
- Redis cache layer
- TTL: 1 hodina (nastaviteľné)
- Logging: cache hits/misses

## 🚀 Deployment

### **Development**
```bash
npm run dev
```

### **Production Build**
```bash
npm run build
npm start
```

### **Docker**
```bash
npm run docker:build
npm run docker:run
```

### **Docker Compose**
```bash
npm run docker:compose
```

## 🧪 Testing

### **Unit Tests**
```bash
npm run test:unit
```

### **Integration Tests**
```bash
npm run test:integration
```

### **Coverage Report**
```bash
npm run test:report
```

## 🔧 Troubleshooting

### **Problém: Redis connection failed**
```bash
# Skontrolujte, či Redis beží
redis-cli ping

# Ak používate Docker
docker ps | grep redis
```

### **Problém: Supabase connection failed**
```bash
# Skontrolujte environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### **Problém: Tests failing**
```bash
# Spustite testy s verbose output
npm run test -- --verbose

# Skontrolujte Jest setup
npm run test -- --no-cache
```

## 📊 Monitoring Dashboard

Po spustení aplikácie môžete monitorovať:

1. **Health**: `http://localhost:3000/api/health`
2. **Metrics**: `http://localhost:3000/api/metrics`
3. **Logs**: V konzole alebo Docker logs
4. **Cache**: Redis CLI alebo logs

## 🎯 Ďalšie kroky

1. **Implementovať reálne API endpointy** - nahradiť mock data
2. **Pridať autentifikáciu** - Supabase Auth
3. **Implementovať AI features** - OpenAI/Anthropic
4. **Pridať analytics** - reálne metriky
5. **Optimalizovať performance** - caching, lazy loading
6. **Pridať monitoring** - Grafana dashboard

## 📞 Support

Ak máte problémy:

1. Skontrolujte logs: `npm run logs:view`
2. Spustite health check: `npm run health:check`
3. Skontrolujte Docker status: `npm run status`
4. Restartujte aplikáciu: `npm run restart:app`

---

**Úspešne ste dokončili overnight bootstrap! 🎉**
