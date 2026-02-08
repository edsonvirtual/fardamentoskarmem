# 🌐 Opções de Deploy - Comparação

## 1. Neon + Render ⭐ (Recomendado)

| Aspecto | Detalhe |
|---------|---------|
| **Banco de Dados** | Neon (PostgreSQL Serverless) |
| **Aplicação** | Render (Node.js) |
| **Custo Inicial** | **GRATUITO** |
| **Performance** | Excelente |
| **Scaling** | Automático |
| **Backup** | Neon → Automático (Pro) |
| **Documentação** | Excelente |
| **Region** | Global |

### Setup
- [Neon Dashboard](https://console.neon.tech)
- [Render Dashboard](https://render.com)
- Ver instructões em [DEPLOY.md](./DEPLOY.md)

---

## 2. Railway 🚄

| Aspecto | Detalhe |
|---------|---------|
| **Banco de Dados** | PostgreSQL nativa |
| **Aplicação** | Node.js nativa |
| **Custo Inicial** | **$5/mês** com créditos iniciais |
| **Performance** | Muito boa |
| **Ease of Use** | Muito fácil |
| **Dashboard** | Intuitivo |

### Setup
```
1. Railway.app → Sign up com GitHub
2. Create → PostgreSQL + Node.js
3. Conectar repositório
4. Deploy automático
```

---

## 3. Heroku (Cobrado) 💳

| Aspecto | Detalhe |
|---------|---------|
| **Custo** | ~$7/mês (dyno básico) |
| **Banco de Dados** | PostgreSQL (~$9/mês) |
| **Total** | ~$16/mês |
| **Status** | Ainda suportado (2024) |
| **Deprecation** | Free tier descontinuado |

### Setup
```bash
heroku login
heroku create karmem-fardamentos
heroku addons:create heroku-postgresql:standard-0
git push heroku main
```

---

## 4. AWS + RDS + ElasticBeanstalk 📦

| Aspecto | Detalhe |
|---------|---------|
| **Custo** | Variável (~$20/mês) |
| **Complexidade** | Alta |
| **Escalabilidade** | Extrema |
| **Support** | Comunidade vast |
| **Recomendado para** | Grande escala |

---

## 5. DigitalOcean App Platform 🌊

| Aspecto | Detalhe |
|---------|---------|
| **Custo** | $5/mês (basic) |
| **BD** | PostgreSQL gerenciado |
| **Facilidade** | Média-Alta |
| **Documentação** | Boa |

### Setup
1. DigitalOcean → App Platform
2. Conectar GitHub
3. Configurar build/start
4. Deploy com 1 click

---

## 6. Vercel + Neon (Serverless) ⚡

| Aspecto | Detalhe |
|---------|---------|
| **Plataforma** | Vercel (originalmente para Next.js) |
| **BD** | Neon |
| **Melhor para** | SPAs estáticas + API lite |
| **Custo** | Gratuito |

### Limitações
- Sem sessões persistentes (serverless)
- Cold starts
- Melhor para leitura do que escrita

---

## 📊 Comparação Rápida

```
┌──────────────────┬────────┬──────────┬───────────┬─────────────┐
│ Plataforma       │ Custo  │ Facilidade│ Performance│ Recomendado │
├──────────────────┼────────┼──────────┼───────────┼─────────────┤
│ Neon + Render    │ GRÁTIS │ ⭐⭐⭐⭐  │ ⭐⭐⭐⭐ │ ✅ SIM      │
│ Railway          │ $5/mês │ ⭐⭐⭐⭐  │ ⭐⭐⭐⭐ │ ✅ SIM      │
│ DigitalOcean     │ $5/mês │ ⭐⭐⭐   │ ⭐⭐⭐⭐ │ ✅ SIM      │
│ Heroku           │ $16/mês│ ⭐⭐⭐⭐  │ ⭐⭐⭐   │ ⚠️ COBRADO  │
│ Vercel + Neon    │ GRÁTIS │ ⭐⭐    │ ⭐⭐    │ ❌ NÃO      │
│ AWS              │ ~$20   │ ⭐      │ ⭐⭐⭐⭐⭐│ ❌ Complexo │
└──────────────────┴────────┴──────────┴───────────┴─────────────┘
```

---

## 🎯 Recomendação por Caso

### Iniciante / Startup
→ **Neon + Render** (Gratuito + Fácil)

### Orçamento Limitado
→ **Railway** ($5/mês, tudo incluso)

### Aplicação Pesada
→ **DigitalOcean** ou **AWS**

### Máxima Escalabilidade
→ **AWS** ou **Google Cloud**

---

## ✅ Checklist de Deploy

Qualquer plataforma escolhida:

- [ ] Repository criado em GitHub/GitLab
- [ ] `.env` configurado com `DATABASE_URL`
- [ ] Schema PostgreSQL executado
- [ ] `package.json` com script `start`
- [ ] `server.js` suportando variáveis de ambiente
- [ ] `index.html` com URL API dinâmica
- [ ] Teste local: `npm start` → http://localhost:3000
- [ ] Push para repositório remoto
- [ ] Variáveis de ambiente configuradas na plataforma
- [ ] Deploy iniciado
- [ ] Teste em produção: nova venda/orçamento

---

## 🚨 Armadilhas Comuns

| Problema | Solução |
|----------|---------|
| "Module not found" | `npm install` antes de deploy |
| "Cannot connect BD" | DATABASE_URL mal formatado ou tabelas não criadas |
| "CORS error" | `cors` habilitado em server.js |
| "Cold start slow" | Normal em serverless, use Render regular não serverless |
| Porta errada | Render usa PORT=3000, Heroku PORT=process.env.PORT |

---

## 📚 Links Rápidos

- [Neon Docs](https://neon.tech/docs/get-started-with-neon)
- [Render Docs](https://docs.render.com)
- [Railway Docs](https://docs.railway.app)
- [DigitalOcean Docs](https://docs.digitalocean.com)

---

**Gostou de Neon + Render? Veja [DEPLOY.md](./DEPLOY.md) para instruções passo a passo!**
