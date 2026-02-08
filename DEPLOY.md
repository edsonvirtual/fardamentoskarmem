# 📚 Guia de Deploy - Karmem Fardamentos

Este guia explica como publicar o projeto **Karmem Fardamentos** no **Neon** (banco de dados) e **Render** (aplicação).

---

## 1️⃣ Configurar Banco de Dados no Neon

### Passo 1: Criar conta no Neon
1. Aceda a [neon.tech](https://neon.tech)
2. Clique em **"Sign up"** (Criar conta gratuita)
3. Autentique-se com email/Google/GitHub

### Passo 2: Criar projeto
1. Na dashboard, clique em **"New Project"**
2. Escolha um nome: `karmem-fardamentos`
3. Selecione region mais próxima (recomendado: `N. Virginia` se usar Render)
4. Clique em **"Create Project"**

### Passo 3: Obter string de conexão
1. No projeto, aceda a **"Connection string"**
2. Copie a URL **completa** (deve conter `postgresql://...`)
3. Formato esperado:
```
postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require
```

### Passo 4: Executar o schema
1. No Neon, aceda a **"SQL Editor"**
2. Cole o conteúdo de `schema.sql` (PostgreSQL) deste projeto
3. Execute o script para criar as tabelas

---

## 2️⃣ Publicar no Render

### Passo 1: Preparar repositório Git
```bash
cd c:\path\to\karmemfardamentos2026

# Inicializar git (se ainda não tem)
git init
git add .
git commit -m "Karmem Fardamentos v1.0"

# Criar repositório no GitHub/GitLab
# Fazer push do código
```

### Passo 2: Criar conta no Render
1. Aceda a [render.com](https://render.com)
2. Clique em **"Sign up"** (criar conta gratuita)
3. Autentique-se com GitHub/GitLab

### Passo 3: Criar novo Web Service
1. Na dashboard Render, clique em **"New +"** → **"Web Service"**
2. Selecione seu repositório Git do projeto
3. Configure:
   - **Name:** `karmem-fardamentos`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (ou pago conforme necessário)

### Passo 4: Adicionar variáveis de ambiente
1. Na página do serviço, aceda a **"Environment"**
2. Clique em **"Add Environment Variable"** e adicione:

```
DATABASE_URL=postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require
PORT=3000
NODE_ENV=production
```

3. Cole a string de conexão do Neon copiada anteriormente

### Passo 5: Deploy
1. Clique em **"Create Web Service"**
2. O Render irá compilar e fazer deploy automaticamente
3. Quando completo, você terá um URL público como:
```
https://karmem-fardamentos.onrender.com
```

---

## 3️⃣ Atualizar Frontend para URL de Produção

Depois do deploy no Render, atualize o `index.html`:

### Opção A: Detecção automática
```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://karmem-fardamentos.onrender.com/api';
```

### Opção B: Variável de ambiente
Adicione ao `.env.production`:
```
VITE_API_URL=https://karmem-fardamentos.onrender.com/api
```

---

## 4️⃣ Verificar Status de Saúde

After deploy:
1. Aceda à URL do Render: `https://karmem-fardamentos.onrender.com`
2. Deverá ver a página inicial (index.html)
3. Teste em browser: `https://karmem-fardamentos.onrender.com/api/products`

Se receber erro de conexão ao banco:
- Verifique se variável `DATABASE_URL` está correta no Render
- Revise se as tabelas foram criadas no Neon
- Verifique logs: **Render Dashboard** → **Logs**

---

## 5️⃣ Manutenção e Atualizações

### Atualizar código
```bash
git add .
git commit -m "Nova funcionalidade"
git push origin main
```

Render irá fazer deploy automático!

### Acessar banco de dados no Neon
1. Neon Dashboard → **SQL Editor**
2. Pode executar queries diretamente
3. Monitore performance no **Monitoring** tab

---

## ⚠️ Notas Importantes

| Aspecto | Detalhe |
|---------|---------|
| **Segurança** | Never commit `.env` com dados reais! Use `.env.example` |
| **CORS** | O `index.html` deve estar no mesmo domínio ou fazer request para a API corretamente |
| **DNS** | Podem levar 5-10 minutos para propagar |
| **Plano Gratuito** | Render hiberna após 15 min sem atividade (primo acesso demora) |
| **Backup BD** | Configure backups automáticos no Neon (Pro plan) |

---

## 🆘 Troubleshooting

### "Cannot Connect to Database"
- ✅ Verifique `DATABASE_URL` no Render
- ✅ Confirme que schema foi executado no Neon
- ✅ Teste conexão localmente com `.env` preenchido

### "404 Not Found"
- ✅ Verifique se endpoint exato está correto
- ✅ Revise `server.js` para rotas corretas
- ✅ Verifique logs: `Render → Logs → View logs`

### "CORS Errors"
- ✅ Atualize `index.html` com URL correta da API
- ✅ Certifique-se que `cors` está ativado em `server.js`

---

## 📞 Links Úteis

- **Neon Docs:** https://neon.tech/docs
- **Render Docs:** https://render.com/docs
- **PostgreSQL:** https://www.postgresql.org/docs/
- **Express.js:** https://expressjs.com

---

**Pronto para ir viral! 🚀**
