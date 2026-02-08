# ✅ Checklist Prático de Deploy - Neon + Render

Siga este checklist para publicar seu projeto **Karmem Fardamentos** na internet em ~15 minutos.

---

## 📋 Fase 1: Preparação Local (10 min)

- [ ] Abre terminal/cmd
- [ ] Navega até pasta do projeto
  ```bash
  cd c:\...\karmemfardamentos2026
  ```
- [ ] Verifica se Git está instalado
  ```bash
  git --version
  ```
- [ ] Instala dependências npm (se não tiver)
  ```bash
  npm install
  ```
- [ ] Testa servidor localmente
  ```bash
  npm start
  ```
  - Acede a http://localhost:3000
  - Tenta criar venda/orçamento
  - Verifica browser console (F12) → nenhum erro
- [ ] Para servidor (Ctrl+C)

---

## 🗄️ Fase 2: Neon - Banco de Dados (3 min)

### 2.1 Criar Conta
- [ ] Acede [neon.tech](https://neon.tech)
- [ ] Clica "Sign up" (pode usar GitHub)
- [ ] Completa autenticação

### 2.2 Criar Projeto
- [ ] Clica "New Project"
- [ ] **Name:** `karmem-fardamentos`
- [ ] **Region:** `N. Virginia` (compatível Render)
- [ ] Clica "Create Project"

### 2.3 Executar Schema
- [ ] Na dashboard Neon, vai a **"SQL Editor"**
- [ ] Copia todo conteúdo de `schema.sql` do projeto
- [ ] Cola no editor do Neon
- [ ] Clica "Execute" ou aperta Ctrl+Enter
- [ ] Verifica se não tem erros

### 2.4 Copiar Connection String
- [ ] Na dashboard, clica **"Connection strings"**
- [ ] Seleciona **"Nodejs"**
- [ ] **COPIA TUDO** (deve comecar com `postgresql://`)
- [ ] **GUARDA ESTA STRING** - vai precisar!

---

## 🐙 Fase 3: GitHub - Publicar Código (3 min)

### 3.1 Criar Repositório
- [ ] Acede [github.com](https://github.com)
- [ ] Clica **"New"** (criar novo repo)
- [ ] **Repository name:** `karmem-fardamentos`
- [ ] **Description:** `Sistema de gestão Karmem Fardamentos`
- [ ] **Public** (para acessibilidade)
- [ ] Clica **"Create repository"**

### 3.2 Push Código Local
- [ ] Terminal no projeto local:
  ```bash
  git init
  git add .
  git commit -m "Karmem Fardamentos v1.0"
  git branch -M main
  git remote add origin https://github.com/SEU_USERNAME/karmem-fardamentos.git
  git push -u origin main
  ```
- [ ] Verifica [github.com](https://github.com/seu_username/karmem-fardamentos) - código lá? ✓

---

## 🚀 Fase 4: Render - Deploy Aplicação (5 min)

### 4.1 Conectar Render
- [ ] Acede [render.com](https://render.com)
- [ ] Clica "Sign up" (use GitHub para ser rápido)
- [ ] Autoriza acesso ao GitHub

### 4.2 Criar Web Service
- [ ] Dashboard Render → **"New"** → **"Web Service"**
- [ ] Seleciona seu repositório `karmem-fardamentos`
- [ ] Preenche:
  - **Name:** `karmem-fardamentos`
  - **Environment:** `Node`
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - **Plan:** `Free` (gratuito!)

### 4.3 Adicionar Variáveis de Ambiente
- [ ] Na página do serviço → **"Environment"**
- [ ] Clica **"Add Environment Variable"** (2x):

**Variável 1:**
- Key: `DATABASE_URL`
- Value: (COLA A STRING DO NEON do passo 2.4)

**Variável 2:**
- Key: `NODE_ENV`
- Value: `production`

- [ ] Clica **"Save"** para cada uma

### 4.4 Iniciar Deploy
- [ ] Clica **"Create Web Service"**
- [ ] Espera enquanto compila...
- [ ] Quando terminar, terá uma URL tipo:
  ```
  https://karmem-fardamentos.onrender.com
  ```
- [ ] **COPIA ESTA URL**

---

## 🔗 Fase 5: Testar em Produção (2 min)

- [ ] Acede URL do Render (ex: `https://karmem-fardamentos.onrender.com`)
- [ ] Deverá ver página inicial
- [ ] **Testa:**
  - [ ] Cria novo produto
  - [ ] Cria novo cliente
  - [ ] Cria venda
  - [ ] Imprime cupom
  - [ ] Imprime etiqueta
  - [ ] Gera PDF
- [ ] Se tudo funciona → **🎉 PRONTO!**

---

## ❌ Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Cannot connect to database" | Revisa `DATABASE_URL` em Render → Logs |
| "Module not found" | Commit necessário: `git add .` → `git commit` → `git push` |
| "404 Not Found" | Acede `https://karmem-fardamentos.onrender.com/api/products` |
| Demora MUITO ao carregar | Render free tier hiberna → É normal, será rápido depois |

---

## 🎁 Bonus: Domínio Personalizado

Se quiser domínio próprio (ex: `https://karmem.com.br`):

1. Compra domínio em **Namecheap** ou **GoDaddy**
2. Em Render → Seu serviço → **Settings** → **Custom Domain**
3. Adiciona seu domínio
4. Segue instruções para DNS

---

## 📊 Resumo do que foi Feito

```
Seu Computador (Local)
        ↓
        ├─→ github.com (Código)
        │
Render (Aplicação Node.js)
        ↓
        └─→ Neon (Banco PostgreSQL)
```

Agora está VIVO na internet! 🌍

---

## ✨ Próximos Passos

1. **Backup**: Configure backup automático no Neon (Pro plan)
2. **Monitoring**: Ativa alertas no Render
3. **CI/CD**: Código que faz push = deploy automático
4. **Custom Domain**: Adiciona domínio próprio
5. **Tell the World**: Compartilha link com clientes!

---

## 📞 Precisa Ajuda?

- **Logs Render**: Clica "Logs" no painel Render
- **Logs Neon**: SQL Editor → Check monitoring
- **Docs**: [Render Docs](https://docs.render.com) | [Neon Docs](https://neon.tech/docs)

---

**Pronto para mostrar ao mundo! 🚀**

*Qualquer dúvida, revê [DEPLOY.md](./DEPLOY.md) para instruções detalhadas.*
