# Configuração de Detecção de Ambiente

## Para o `index.html`

Localize esta linha no seu `index.html`:

```javascript
const API_URL = 'http://localhost:3000/api';
```

Substitua por:

```javascript
// Detecção automática do ambiente
const API_URL = (() => {
    const hostname = window.location.hostname;
    const isDev = hostname === 'localhost' || hostname === '127.0.0.1';
    const isLocal = hostname.includes('192.168') || hostname.includes('10.0');
    
    if (isDev || isLocal) {
        return 'http://localhost:3000/api';
    } else {
        // Produção (Render)
        return 'https://karmem-fardamentos.onrender.com/api';
    }
})();

console.log(`📡 API URL: ${API_URL}`);
```

Isto permite que o código funcione tanto em **desenvolvimento local** quanto em **produção no Render**.

---

## Alternativa: Usando Variáveis de Ambiente

Se usar um bundler como Vite/Webpack:

### 1. Crie arquivo `.env.local`
```
VITE_API_URL=http://localhost:3000/api
```

### 2. Crie arquivo `.env.production`
```
VITE_API_URL=https://karmem-fardamentos.onrender.com/api
```

### 3. No `index.html` ou arquivo JS:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Recomendação

Para este projeto simples (sem bundler), use a **primeira opção** (detecção automática).

Se no futuro usar Vite/React/Vue, migre para variáveis de ambiente.
