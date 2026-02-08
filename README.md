# 🎯 Karmem Fardamentos - Sistema de Gestão

Sistema completo de PDV (Ponto de Venda) profissional para gerenciamento de vendas, orçamentos, estoque e clientes em loja de alta costura e uniformes.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)

---

## ✨ Funcionalidades

### 📊 Dashboard
- Relatórios de vendas e orçamentos
- Gráficos de performance
- Monitoramento de estoque em tempo real

### 💰 Vendas & Orçamentos
- Sistema POS com scanner de código de barras
- Orçamentos com status (Pendente/Aprovado/Recusado)
- Gestão de pagamentos parciais
- Impressão de cupom térmico (58mm)

### 📦 Inventário
- Controle de estoque por tamanho
- Geração automática de etiquetas QR (40×60mm)
- Importação/exportação de produtos

### 👥 Gestão de Clientes
- Cadastro completo com medidas (ombro, peito, cintura, quadril, mangas)
- Histórico de vendas
- Integração com WhatsApp

### 🖨️ Impressão Profissional
- **PDF Formal**: Orçamentos com assinatura digital
- **Etiqueta Térmica**: QR code + preço (40×60mm)
- **Cupom Fiscal**: Recibo de venda (58mm)
- **Compartilhamento**: Envio via WhatsApp

---

## 🚀 QuickStart Local

### Pré-requisitos
- **Node.js** ≥ 14.0
- **PostgreSQL** (local ou Neon)
- **npm** ou **yarn**

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/karmem-fardamentos.git
cd karmem-fardamentos

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env

# 4. Edite .env com suas credenciais PostgreSQL
# Opção A: Local
# DB_HOST=localhost
# DB_USER=postgres
# DB_PASSWORD=sua_senha
# DB_NAME=karmem_db

# 5. Execute o schema
# - Abra pgAdmin/psql
# - Execute: cat schema.sql | psql -U postgres -d karmem_db

# 6. Inicie servidor
npm start

# 7. Aceda a http://localhost:3000
```

---

## 📚 Publicação em Produção

### Opção 1: Neon + Render (Recomendado)

**Banco de dados:** Neon (PostgreSQL Serverless)  
**Aplicação:** Render (Node.js)  
**Custo:** Ambos têm tier gratuito

```bash
# 1. Criar projeto no Neon (neon.tech)
# 2. Copiar DATABASE_URL
# 3. Fazer push para GitHub
# 4. Conectar no Render (render.com)
# 5. Adicionar variável DATABASE_URL
# 6. Deploy automático!
```

**Guia detalhado:** Ver [DEPLOY.md](./DEPLOY.md)

### Opção 2: Outras Plataformas
- Railway
- Heroku (pago)
- AWS/Azure/DigitalOcean

---

## 🏗️ Estrutura do Projeto

```
karmem-fardamentos/
├── index.html              # Frontend SPA
├── server.js               # API Node.js
├── schema.sql              # Schema PostgreSQL
├── package.json            # Dependências
├── .env.example            # Variáveis exemplo
├── DEPLOY.md               # Guia de publicação
├── ENV_CONFIG.md           # Configuração de ambientes
└── css/                    # Estilos
```

---

## 🔧 Tecnologias

| Camada | Stack |
|--------|-------|
| **Frontend** | HTML5, Bootstrap 5, TailwindCSS, Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL, Neon |
| **Impressão** | html2pdf, QRCode.js |
| **Deploy** | Render, Neon |

---

## 📖 API Endpoints

### Produtos
```
GET    /api/products       # Listar todos
POST   /api/products       # Criar/atualizar
DELETE /api/products/:id   # Eliminar
```

### Clientes
```
GET    /api/clients        # Listar
POST   /api/clients        # Criar/atualizar
```

### Vendas
```
POST        /api/sales             # Registar venda
GET         /api/sales/client/all  # Todas as vendas
DELETE      /api/sales/:id         # Cancelar venda
```

### Orçamentos
```
GET         /api/quotes       # Listar
POST        /api/quotes       # Criar
POST        /api/quotes/:id/status  # Mudar status
DELETE      /api/quotes/:id   # Eliminar
```

---

## 🎨 Customização

### Cor da Marca
Edite `:root` em `index.html`:
```css
:root {
    --primary: #6a0pad;        /* Roxo principal */
    --secondary: #4f46e5;      /* Azul complementar */
    /* ... */
}
```

### WhatsApp
Personalize mensagem em `shareQuote()`:
```javascript
const message = `Olá ${clientName}...`;
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Verifique se PostgreSQL está rodando
psql -h localhost -U postgres

# Confirme DATABASE_URL ou variáveis .env
cat .env
```

### "API 404 errors"
```javascript
// Em browser, abra Console (F12) e veja:
console.log(API_URL)  // Deve mostrar URL correta
```

### Porta já em uso
```bash
npm start -- --port 3001
# ou mude PORT=3001 em .env
```

---

## 📞 Suporte & Comunidade

- **Issues:** [GitHub Issues](#)
- **Email:** suporte@karmem.com
- **WhatsApp:** [Link](#)

---

## 📄 Licença

MIT © 2026 Karmem Fardamentos

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ para profissionais da moda.

**Instruções detalhadas de deploy:** [DEPLOY.md](./DEPLOY.md)
