const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuração do Banco de Dados PostgreSQL
// Suporta tanto variáveis de ambiente quanto string de conexão (Neon)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL ||
        `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || '1234'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'karmem_db'}`,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // SSL para conexões externas (Neon)
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve o ficheiro index.html na mesma pasta

// ==========================================
// ROTA DE VENDAS (A MAIS IMPORTANTE)
// ==========================================
app.post('/api/sales', async (req, res) => {
    const {
        id, client_id, payment_method, subtotal,
        discount, down_payment, due_date,
        total_amount, items, is_update
    } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (is_update) {
            // LÓGICA DE UPDATE (DAR BAIXA): 
            // Atualiza apenas os campos financeiros e o prazo sem duplicar o ID.
            // O valor 'down_payment' recebido já vem somado da interface.
            await client.query(
                `UPDATE sales 
                 SET client_id = $1, payment_method = $2, subtotal = $3, 
                     discount = $4, down_payment = $5, due_date = $6, 
                     total_amount = $7 
                 WHERE id = $8`,
                [client_id, payment_method, subtotal, discount, down_payment, due_date, total_amount, id]
            );

            // Opcional: Atualizar os itens se necessário (em atualizações financeiras puras não costuma mudar)
            await client.query('DELETE FROM sale_items WHERE sale_id = $1', [id]);
            for (const item of items) {
                await client.query(
                    'INSERT INTO sale_items (sale_id, product_id, product_name, quantity, price_unit) VALUES ($1,$2,$3,$4,$5)',
                    [id, item.id, item.name, item.qty, item.price]
                );
            }

        } else {
            // LÓGICA DE INSERÇÃO (VENDA NOVA):
            await client.query(
                `INSERT INTO sales (id, client_id, payment_method, subtotal, discount, down_payment, due_date, total_amount) 
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                [id, client_id, payment_method, subtotal, discount, down_payment, due_date, total_amount]
            );

            // Grava os itens e REDUZ O STOCK (Apenas em vendas novas)
            for (const item of items) {
                await client.query(
                    'INSERT INTO sale_items (sale_id, product_id, product_name, quantity, price_unit) VALUES ($1,$2,$3,$4,$5)',
                    [id, item.id, item.name, item.qty, item.price]
                );
                await client.query(
                    'UPDATE products SET stock = stock - $1 WHERE id = $2',
                    [item.qty, item.id]
                );
            }
        }

        await client.query('COMMIT');
        res.json({ success: true, message: is_update ? 'Baixa efetuada' : 'Venda registada' });
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("Erro no Processamento de Venda:", e.message);
        res.status(500).json({ error: e.message });
    } finally {
        client.release();
    }
});

// ==========================================
// ROTA DE PRODUTOS
// ==========================================
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY name ASC');
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/products', async (req, res) => {
    const { id, name, size, price, stock } = req.body;
    try {
        if (id) {
            await pool.query('UPDATE products SET name=$1, size=$2, price=$3, stock=$4 WHERE id=$5', [name, size, price, stock, id]);
            res.json({ id });
        } else {
            const result = await pool.query('INSERT INTO products (name, size, price, stock) VALUES ($1,$2,$3,$4) RETURNING id', [name, size, price, stock]);
            res.json(result.rows[0]);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ==========================================
// ROTA DE CLIENTES
// ==========================================
app.get('/api/clients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clients ORDER BY name ASC');
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/clients', async (req, res) => {
    const { id, name, phone, cpf, m_bust, m_waist, m_hips, m_shoulder, m_sleeve } = req.body;
    try {
        if (id) {
            await pool.query(
                `UPDATE clients SET name=$1, phone=$2, cpf=$3, m_bust=$4, m_waist=$5, m_hips=$6, m_shoulder=$7, m_sleeve=$8 
                 WHERE id=$9`,
                [name, phone, cpf, m_bust, m_waist, m_hips, m_shoulder, m_sleeve, id]
            );
            res.json({ id });
        } else {
            const result = await pool.query(
                `INSERT INTO clients (name, phone, cpf, m_bust, m_waist, m_hips, m_shoulder, m_sleeve) 
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
                [name, phone, cpf, m_bust, m_waist, m_hips, m_shoulder, m_sleeve]
            );
            res.json(result.rows[0]);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ==========================================
// ROTA DE ORÇAMENTOS (QUOTES)
// ==========================================
app.get('/api/quotes', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT q.*, c.name as client_name 
            FROM quotes q 
            LEFT JOIN clients c ON q.client_id = c.id 
            ORDER BY created_at DESC
        `);
        // Para cada orçamento, buscar os seus itens
        const quotes = result.rows;
        for (let quote of quotes) {
            const items = await pool.query('SELECT * FROM quote_items WHERE quote_id = $1', [quote.id]);
            quote.items = items.rows;
        }
        res.json(quotes);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/quotes', async (req, res) => {
    const { id, client_id, total_amount, items } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('INSERT INTO quotes (id, client_id, total_amount, status) VALUES ($1,$2,$3,$4)', [id, client_id, total_amount, 'Pendente']);
        for (const item of items) {
            await client.query('INSERT INTO quote_items (quote_id, product_id, product_name, quantity, price_unit) VALUES ($1,$2,$3,$4,$5)', [id, item.id, item.name, item.qty, item.price]);
        }
        await client.query('COMMIT');
        res.json({ success: true });
    } catch (e) { await client.query('ROLLBACK'); res.status(500).json({ error: e.message }); }
    finally { client.release(); }
});

app.post('/api/quotes/:id/status', async (req, res) => {
    try {
        await pool.query('UPDATE quotes SET status = $1 WHERE id = $2', [req.body.status, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/quotes/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM quotes WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ==========================================
// ROTA PARA RELATÓRIOS (SALES DETAILED)
// ==========================================
app.get('/api/sales/client/all', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, c.name as client_name 
            FROM sales s 
            LEFT JOIN clients c ON s.client_id = c.id 
            ORDER BY sale_date DESC
        `);
        const sales = result.rows;
        for (let sale of sales) {
            const items = await pool.query('SELECT * FROM sale_items WHERE sale_id = $1', [sale.id]);
            sale.items = items.rows;
        }
        res.json(sales);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/sales/:id', async (req, res) => {
    try {
        // Estorno: Devolve o stock antes de apagar
        const items = await pool.query('SELECT product_id, quantity FROM sale_items WHERE sale_id = $1', [req.params.id]);
        for (const item of items.rows) {
            await pool.query('UPDATE products SET stock = stock + $1 WHERE id = $2', [item.quantity, item.product_id]);
        }
        await pool.query('DELETE FROM sales WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Inicia o Servidor
app.listen(port, () => {
    console.log(`--- SISTEMA KARMEM FARDAMENTOS LIGADO ---`);
    console.log(`Endereço local: http://localhost:${port}`);
});