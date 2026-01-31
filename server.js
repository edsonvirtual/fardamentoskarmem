const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// CONFIGURAÇÃO DE FICHEIROS ESTÁTICOS
// Isto garante que o Render encontre o seu index.html e pastas adjacentes
app.use(express.static(path.join(__dirname)));

// --- CONFIGURAÇÃO DA BASE DE DADOS ---
const isProduction = process.env.DATABASE_URL ? true : false;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:SUA_SENHA@localhost:5432/karmem_db',
    ssl: isProduction ? { rejectUnauthorized: false } : false 
});

// Teste de conexão imediato para o Log do Render
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar à base de dados:', err.stack);
    }
    console.log('Conexão com a base de dados estabelecida com sucesso!');
    release();
});

// ROTA PRINCIPAL: Entrega o index.html quando acede ao link
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- ROTAS DA API ---

// Estorno com atualização de stock
app.delete('/api/sales/:id', async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const items = await client.query('SELECT product_id, quantity FROM sale_items WHERE sale_id = $1', [id]);
        for (const item of items.rows) {
            if (item.product_id) {
                await client.query('UPDATE products SET stock = stock + $1 WHERE id = $2', [item.quantity, item.product_id]);
            }
        }
        await client.query('DELETE FROM sales WHERE id = $1', [id]);
        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

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
            const result = await pool.query('INSERT INTO products (name, size, price, stock) VALUES ($1, $2, $3, $4) RETURNING id', [name, size, price, stock]);
            res.json(result.rows[0]);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/clients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clients ORDER BY name ASC');
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/clients', async (req, res) => {
    const c = req.body;
    try {
        if (c.id) {
            await pool.query('UPDATE clients SET name=$1, phone=$2, email=$3, cpf=$4, address=$5, m_bust=$6, m_waist=$7, m_hips=$8, m_shoulder=$9, m_sleeve=$10, m_length_up=$11, m_length_down=$12, notes=$13 WHERE id=$14', 
            [c.name, c.phone, c.email, c.cpf, c.address, c.m_bust, c.m_waist, c.m_hips, c.m_shoulder, c.m_sleeve, c.m_length_up, c.m_length_down, c.notes, c.id]);
            res.json({ id: c.id });
        } else {
            const result = await pool.query('INSERT INTO clients (name, phone, email, cpf, address, m_bust, m_waist, m_hips, m_shoulder, m_sleeve, m_length_up, m_length_down, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id', 
            [c.name, c.phone, c.email, c.cpf, c.address, c.m_bust, c.m_waist, c.m_hips, c.m_shoulder, c.m_sleeve, c.m_length_up, c.m_length_down, c.notes]);
            res.json(result.rows[0]);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/sales', async (req, res) => {
    const { id, client_id, paymentMethod, subtotal, discount, total, items } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('INSERT INTO sales (id, client_id, payment_method, subtotal, discount, total_amount) VALUES ($1,$2,$3,$4,$5,$6)', [id, client_id, paymentMethod, subtotal, discount, total]);
        for (const item of items) {
            await client.query('INSERT INTO sale_items (sale_id, product_id, product_name, quantity, price_unit) VALUES ($1,$2,$3,$4,$5)', [id, item.id, item.name, item.qty, item.price]);
            await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.qty, item.id]);
        }
        await client.query('COMMIT');
        res.json({ success: true });
    } catch (e) { await client.query('ROLLBACK'); res.status(500).json({ error: e.message }); }
    finally { client.release(); }
});

app.get('/api/sales/client/all', async (req, res) => {
    try {
        const result = await pool.query('SELECT s.*, c.name as client_name FROM sales s LEFT JOIN clients c ON s.client_id = c.id ORDER BY s.sale_date DESC');
        for(let sale of result.rows) {
            const items = await pool.query('SELECT * FROM sale_items WHERE sale_id = $1', [sale.id]);
            sale.items = items.rows;
        }
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/quotes', async (req, res) => {
    try {
        const result = await pool.query('SELECT q.*, c.name as client_name FROM quotes q LEFT JOIN clients c ON q.client_id = c.id ORDER BY q.created_at DESC');
        for(let q of result.rows) {
            const items = await pool.query('SELECT * FROM quote_items WHERE quote_id = $1', [q.id]);
            q.items = items.rows;
        }
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/quotes', async (req, res) => {
    const { id, client_id, subtotal, discount, total, items } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM quotes WHERE id = $1', [id]);
        await client.query('INSERT INTO quotes (id, client_id, subtotal, discount, total_amount) VALUES ($1,$2,$3,$4,$5)', [id, client_id, subtotal, discount, total]);
        for (const item of items) {
            await client.query('INSERT INTO quote_items (quote_id, product_id, product_name, quantity, price_unit) VALUES ($1,$2,$3,$4,$5)', [id, item.id, item.name, item.qty, item.price]);
        }
        await client.query('COMMIT');
        res.json({ success: true });
    } catch (e) { await client.query('ROLLBACK'); res.status(500).json({ error: e.message }); }
    finally { client.release(); }
});

app.post('/api/quotes/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE quotes SET status = $1 WHERE id = $2', [status, id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/:col/:id', async (req, res) => {
    const { col, id } = req.params;
    try {
        await pool.query(`DELETE FROM ${col} WHERE id = $1`, [id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Karmem Fardamentos rodando na porta ${PORT}`));
