
    const API_URL = 'http://localhost:3000/api';
    let db = { products: [], clients: [], sales: [], quotes: [] };
    let cart = [];
    let isOnline = false;

    // --- COMUNICAÇÃO ---
    async function api(path, method = 'GET', body = null) {
        try {
            const options = { method, headers: { 'Content-Type': 'application/json' } };
            if (body) options.body = JSON.stringify(body);
            const res = await fetch(`${API_URL}${path}`, options);
            const text = await res.text();
            let data;
            try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
            if (!res.ok) throw new Error(data.error || data.message || `Erro ${res.status}`);
            updateStatus(true);
            return data;
        } catch (e) { updateStatus(false); throw e; }
    }

    function updateStatus(online) {
        const badge = document.getElementById('connection-status');
        isOnline = online;
        badge.innerText = online ? 'LIGADO' : 'OFFLINE';
        badge.className = `status-badge ${online ? 'bg-success text-white shadow-sm' : 'bg-danger text-white animate-pulse'}`;
    }

    async function loadAllData() {
        try {
            const [p, c, q] = await Promise.all([api('/products'), api('/clients'), api('/quotes')]);
            db.products = p || []; db.clients = c || []; db.quotes = q || [];
            window.render();
        } catch (err) { updateStatus(false); }
    }

    // --- RENDERIZAÇÃO ---
    window.render = () => {
        const search = document.getElementById('search-pos').value.toLowerCase();
        
        // Grid de Produtos (Vendas)
        document.getElementById('pos-grid').innerHTML = db.products
            .filter(p => p.name.toLowerCase().includes(search))
            .map(p => `
            <div class="col-md-4">
                <div class="card card-product border-0 shadow-sm h-100 ${p.stock <= 0 ? 'opacity-50 grayscale' : ''}" onclick="${p.stock > 0 ? `window.addToCart(${p.id})` : ''}">
                    <div class="card-body">
                        <span class="badge bg-primary mb-2">${p.size}</span>
                        <h6 class="fw-bold text-truncate m-0">${p.name}</h6>
                        <p class="text-primary fw-bold mt-2 mb-0">R$ ${parseFloat(p.price).toFixed(2)}</p>
                        <small class="${p.stock <= 3 ? 'text-danger fw-bold' : 'text-muted'}">Disp: ${p.stock}</small>
                    </div>
                </div>
            </div>`).join('');

        // Tabela de Orçamentos
        document.getElementById('all-quotes-table').innerHTML = db.quotes.map(q => {
            const total = q.total || q.total_amount || 0;
            const status = q.status || 'Pendente';
            const statusColors = { 'Pendente': 'bg-warning text-dark', 'Aprovado': 'bg-success text-white', 'Cancelado': 'bg-secondary text-white' };
            
            return `
            <tr class="${status === 'Cancelado' ? 'opacity-50' : ''}">
                <td><b>#${q.id.toString().split('-').pop()}</b></td>
                <td>${q.date}</td>
                <td>${q.client_name || 'Avulso'}</td>
                <td>R$ ${parseFloat(total).toFixed(2)}</td>
                <td><span class="badge ${statusColors[status]}">${status.toUpperCase()}</span></td>
                <td class="text-center">
                    <div class="btn-group shadow-sm">
                        <button onclick="window.shareQuote('${q.id}', 'whatsapp')" class="btn btn-sm btn-success px-2"><i class="bi bi-whatsapp"></i></button>
                        <button onclick="window.printFormalPDF('${q.id}')" class="btn btn-sm btn-primary px-2"><i class="bi bi-file-earmark-pdf"></i></button>
                    </div>
                </td>
                <td class="text-end">
                    ${status === 'Pendente' ? `<button onclick="window.updateQuoteStatus('${q.id}', 'Aprovado')" class="btn btn-xs btn-outline-success py-0 px-2">Aprovar</button>` : ''}
                    ${status !== 'Cancelado' ? `<button onclick="window.deleteDoc('quotes', '${q.id}')" class="btn btn-sm text-danger"><i class="bi bi-trash"></i></button>` : ''}
                </td>
            </tr>`}).join('');

        // Estoque e Clientes
        document.getElementById('inventory-table').innerHTML = db.products.map(p => `<tr><td><b>${p.name}</b> (${p.size})</td><td>R$ ${parseFloat(p.price).toFixed(2)}</td><td><span class="badge ${p.stock <= 3 ? 'bg-danger' : 'bg-success'}">${p.stock}</span></td><td class="text-end"><button onclick="window.editProd(${p.id})" class="btn btn-sm text-warning"><i class="bi bi-pencil"></i></button></td></tr>`).join('');
        document.getElementById('clients-table').innerHTML = db.clients.map(c => `<tr><td><b>${c.name}</b></td><td>O:${c.m_ombro||'-'} P:${c.m_peito||'-'} C:${c.m_cintura||'-'} Q:${c.m_quadril||'-'}</td><td class="text-end"><button onclick="window.editCli(${c.id})" class="btn btn-sm text-warning"><i class="bi bi-pencil"></i></button></td></tr>`).join('');
        
        const opts = '<option value="">Venda Avulsa</option>' + db.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        document.getElementById('client-select-pos').innerHTML = opts;
    }

    // --- GERAÇÃO DE PDF CORRIGIDA ---
    window.printFormalPDF = async (id) => {
        const q = db.quotes.find(x => x.id == id);
        if (!q) return alert("Orçamento não encontrado!");
        
        const client = db.clients.find(c => String(c.id) === String(q.client_id));
        const clientName = client?.name || q.client_name || 'Avulso';
        const fileName = `Orcamento_${clientName.replace(/\s+/g, '_')}_${q.id.toString().split('-').pop()}.pdf`;

        // Montagem do HTML Interno do PDF
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
                <div style="border-bottom: 3px solid #6a0dad; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h1 style="color: #6a0dad; margin: 0; font-size: 28px;">KARMEM FARDAMENTOS</h1>
                        <p style="margin: 5px 0; color: #666; font-size: 12px; letter-spacing: 1px;">GESTÃO PROFISSIONAL DE UNIFORMES</p>
                    </div>
                    <div style="text-align: right;">
                        <h2 style="margin: 0; font-size: 18px;">ORÇAMENTO Nº ${q.id.toString().split('-').pop()}</h2>
                        <p style="margin: 0; font-size: 12px;">Data: ${q.date}</p>
                    </div>
                </div>

                <div style="margin-bottom: 30px; display: flex; justify-content: space-between; background: #f9f9f9; padding: 15px; border-radius: 8px;">
                    <div>
                        <strong style="font-size: 10px; color: #6a0dad;">CLIENTE:</strong><br>
                        <span style="font-size: 14px; font-weight: bold;">${clientName}</span><br>
                        <span style="font-size: 12px;">Tel: ${client?.phone || 'Não informado'}</span>
                    </div>
                    <div style="text-align: right;">
                        <strong style="font-size: 10px; color: #6a0dad;">FORNECEDOR:</strong><br>
                        <span style="font-size: 12px; font-weight: bold;">Karmem Fardamentos</span><br>
                        <span style="font-size: 11px;">Pernambuco, Brasil</span>
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background: #6a0dad; color: white;">
                            <th style="padding: 10px; text-align: left; font-size: 12px;">DESCRIÇÃO DO PRODUTO</th>
                            <th style="padding: 10px; text-align: center; font-size: 12px;">QTD</th>
                            <th style="padding: 10px; text-align: right; font-size: 12px;">UNIT.</th>
                            <th style="padding: 10px; text-align: right; font-size: 12px;">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(q.items || []).map(i => {
                            const pName = i.product_name || i.name || "Produto";
                            const pPrice = parseFloat(i.price_unit || i.price || 0);
                            const pQty = parseInt(i.quantity || i.qty || 0);
                            return `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 12px 10px; font-size: 12px;">${pName.toUpperCase()}</td>
                                <td style="padding: 12px 10px; text-align: center; font-size: 12px;">${pQty}</td>
                                <td style="padding: 12px 10px; text-align: right; font-size: 12px;">R$ ${pPrice.toFixed(2)}</td>
                                <td style="padding: 12px 10px; text-align: right; font-size: 12px; font-weight: bold;">R$ ${(pQty * pPrice).toFixed(2)}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>

                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 250px; background: #f4f4f4; padding: 20px; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>Subtotal:</span><span>R$ ${parseFloat(q.subtotal || 0).toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #d9534f;">
                            <span>Desconto:</span><span>- R$ ${parseFloat(q.discount || 0).toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #6a0dad; border-top: 2px solid #ddd; padding-top: 10px;">
                            <span>TOTAL:</span><span>R$ ${parseFloat(q.total || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 60px; font-size: 10px; color: #888; text-align: center;">
                    <p>Este orçamento é válido por 7 dias a partir da data de emissão.</p>
                    <p>Karmem Fardamentos - Qualidade e Compromisso em cada detalhe.</p>
                </div>
            </div>
        `;

        const opt = {
            margin: 10,
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Executa a conversão
        try {
            await html2pdf().set(opt).from(htmlContent).save();
        } catch (error) {
            console.error("Erro no PDF:", error);
            alert("Erro ao gerar PDF. Verifique o console.");
        }
    };

    // --- OUTRAS FUNÇÕES ---
    window.addToCart = (id) => { 
        const p = db.products.find(x => x.id == id);
        const inCart = cart.find(x => x.id == id);
        if (inCart) inCart.qty++; else cart.push({ ...p, qty: 1, price: parseFloat(p.price) });
        window.updateCartUI(); 
    };

    window.updateCartUI = () => {
        let subtotal = 0;
        const dVal = parseFloat(document.getElementById('discount-input').value) || 0;
        const dType = document.getElementById('discount-type').value;
        document.getElementById('cart-items').innerHTML = cart.map((item, i) => {
            subtotal += item.price * item.qty;
            return `<div class="d-flex justify-content-between mb-2 bg-light p-2 rounded-3 border-start border-4 border-primary"><span>${item.qty}x ${item.name}</span><button onclick="cart.splice(${i},1);window.updateCartUI()" class="btn btn-sm text-danger p-0"><i class="bi bi-x-circle-fill"></i></button></div>`;
        }).join('') || '<p class="text-center py-3 text-muted">Carrinho Vazio</p>';
        let discount = (dType === 'per') ? subtotal * (dVal / 100) : dVal;
        document.getElementById('cart-total').innerText = `R$ ${Math.max(0, subtotal - discount).toFixed(2)}`;
        document.getElementById('btn-finish').disabled = document.getElementById('btn-quote').disabled = cart.length === 0;
    }

    window.handleTransaction = async (type) => {
        if (!isOnline) return alert("Servidor offline!");
        const cid = document.getElementById('client-select-pos').value;
        const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
        const dVal = parseFloat(document.getElementById('discount-input').value) || 0;
        const discount = (document.getElementById('discount-type').value === 'per') ? subtotal * (dVal / 100) : dVal;
        
        const data = { 
            id: (type==='sale'?'KF-':'ORC-') + Date.now().toString().slice(-5), 
            client_id: cid===""?null:cid, 
            paymentMethod: document.getElementById('payment-method-pos').value, 
            subtotal, discount, total: subtotal - discount, items: cart, status: 'Pendente'
        };
        try { await api(type==='sale'?'/sales':'/quotes', 'POST', data); alert("Sucesso!"); cart = []; window.updateCartUI(); loadAllData(); } catch (e) { alert(e.message); }
    }

    window.updateQuoteStatus = async (id, status) => {
        try { await api(`/quotes/${id}/status`, 'PATCH', { status }); loadAllData(); } catch (e) { alert(e.message); }
    }

    window.deleteDoc = async (col, id) => {
        if (confirm("Excluir definitivamente?")) { try { await api(`/${col}/${id}`, 'DELETE'); loadAllData(); } catch (e) { alert(e.message); } }
    }

    window.onload = () => { loadAllData(); setInterval(loadAllData, 15000); };
