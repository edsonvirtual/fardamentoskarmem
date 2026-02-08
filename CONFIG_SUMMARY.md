# 📦 Arquivos de Configuração para Deploy

Este documento lista todos os **arquivos criados/atualizados** para publicação em produção.

---

## 🔄 Arquivos Modificados

### ✏️ `server.js`
**Mudança:** Suporta variáveis de ambiente
```javascript
// ANTES
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '1234',
    database: 'karmem_db'
});

// DEPOIS
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://...',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});
```

### ✏️ `package.json`
**Mudança:** Adicionado `dotenv` e script `dev`
```json
{
  "dependencies": {
    "dotenv": "^16.3.1"  // NOVO
  },
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"    // NOVO
  }
}
```

### ✏️ `index.html`
**Mudança:** Detecção automática de URL API
```javascript
// ANTES
const API_URL = 'http://localhost:3000/api';

// DEPOIS
const API_URL = (() => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    } else {
        return `${window.location.origin}/api`;
    }
})();
```

---

## 📄 Novos Arquivos Criados

### 1. `.env.example`
Modelo de variáveis de ambiente
```
DATABASE_URL=postgresql://...
PORT=3000
```

### 2. `.gitignore`
Arquivos a ignorar em Git
- `node_modules/`
- `.env` (não commit senhas!)
- Logs e temporários

### 3. `README.md`
Documentação completa do projeto
- Funcionalidades
- QuickStart local
- Endpoints de API
- Licença

### 4. `DEPLOY.md`
Guia passo a passo (MAIS DETALHADO)
- Setup Neon
- Deploy no Render
- Troubleshooting

### 5. `DEPLOY_OPTIONS.md`
Comparação de plataformas
- Neon + Render (recomendado)
- Railway
- DigitalOcean
- Heroku
- AWS

### 6. `QUICK_DEPLOY.md`
Checklist prático (15 minutos)
- Setup rápido
- Fase por fase
- Testes

### 7. `ENV_CONFIG.md`
Configuração de ambientes Dev/Prod
- Detecção automática
- Variáveis de ambiente
- Alternativas

---

## 🗂️ Estrutura Final do Projeto

```
karmemfardamentos2026/
├── 📄 index.html              [MODIFICADO - URL dinâmica]
├── 📄 server.js               [MODIFICADO - Variáveis env]
├── 📄 package.json            [MODIFICADO - dotenv adicionado]
│
├── 📋 .env.example            [NOVO - Template env]
├── 🔑 .gitignore              [NOVO - Git ignore]
├── 📖 README.md               [NOVO - Documentação principal]
├── 🚀 DEPLOY.md               [NOVO - Guia detalhado Neon+Render]
├── ⚡ QUICK_DEPLOY.md         [NOVO - Checklist rápido]
├── 🌐 DEPLOY_OPTIONS.md       [NOVO - Comparação plataformas]
├── ⚙️ ENV_CONFIG.md           [NOVO - Config ambientes]
│
├── 📄 schema.sql              (PostgreSQL)
├── 📄 karmem_db.sql           (MySQL)
├── 📁 css/
├── 📁 node_modules/
└── 📁 .github/
```

---

## ✅ Checklist de Publicação

Use este checklist antes de fazer deploy:

```bash
# 1. Git
☐ git init
☐ git add .
☐ git commit -m "Karmem v1.0"
☐ git remote add origin <seu_repo>
☐ git push -u origin main

# 2. Local testing
☐ npm install
☐ npm start
☐ Teste em http://localhost:3000

# 3. Neon
☐ Cria projeto em neon.tech
☐ Executa schema.sql
☐ Copia CONNECTION STRING

# 4. GitHub
☐ Code na branch 'main'
☐ Arquivo .gitignore present
☐ package.json with start script

# 5. Render
☐ Conecta repo GitHub
☐ Build command: npm install
☐ Start command: npm start
☐ Ambiente: Node
☐ DATABASE_URL variable set
☐ Port: 3000

# 6. Teste
☐ Acede URL Render
☐ Cria venda
☐ Gera PDF
☐ Imprime etiqueta
☐ Envia WhatsApp
```

---

## 🔐 Segurança - Importante!

⚠️ **NUNCA committar `.env` com dados sensíveis!**

```bash
# Correto: Usar .env.example como template
git add .env.example

# Errado: Commitar .env com senhas
git add .env  # ❌ NÃO FAÇA!
```

---

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Banco BD** | Só local | Local + Neon (cloud) |
| **Variáveis env** | Hardcoded | Dinâmicas |
| **Deploy** | Impossível | 1-click Render |
| **Documentação** | Nenhuma | 4 guias detalhados |
| **API URL** | Fixa localhost | Automática |
| **Escalabilidade** | 1 PC | ∞ Cloud |

---

## 🎯 Próximas Fases (Opcional)

1. **Eu gostaria de Git branching**
   - `main` → Produção
   - `dev` → Desenvolvimento
   - `feature/*` → Novas features

2. **CI/CD Pipeline**
   - GitHub Actions → Testes automáticos
   - Deploy automático ao fazer push

3. **Monitoramento**
   - Sentry (error tracking)
   - Datadog (logs)

4. **Backup Automático**
   - Neon pro plan
   - ou AWS S3

---

## 📚 Recursos Criados

| Arquivo | Propósito | Leitura |
|---------|-----------|---------|
| `README.md` | Visão geral projeto | 5 min |
| `QUICK_DEPLOY.md` | Deploy rápido | 15 min |
| `DEPLOY.md` | Deploy detalhado | 20 min |
| `DEPLOY_OPTIONS.md` | Comparar plataformas | 10 min |
| `ENV_CONFIG.md` | Variáveis ambiente | 5 min |

---

## 🚀 Começar Agora

**Opção 1: Rápido (15 min)**
→ Siga [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

**Opção 2: Completo (30 min)**
→ Siga [DEPLOY.md](./DEPLOY.md)

**Opção 3: Escolher plataforma**
→ Leia [DEPLOY_OPTIONS.md](./DEPLOY_OPTIONS.md)

---

**Tudo pronto para lançar! 🎉**
