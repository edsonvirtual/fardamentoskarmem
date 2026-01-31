document.addEventListener('DOMContentLoaded', () => {

    // Simula o banco de dados
    const db = {
        products: JSON.parse(localStorage.getItem('products')) || [],
        clients: JSON.parse(localStorage.getItem('clients')) || [],
        sales: JSON.parse(localStorage.getItem('sales')) || [],
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('products', JSON.stringify(db.products));
        localStorage.setItem('clients', JSON.stringify(db.clients));
        localStorage.setItem('sales', JSON.stringify(db.sales));
    };

    let currentCart = [];

    // --- FUNÇÕES GLOBAIS DE RENDERIZAÇÃO ---
    const renderProducts = (targetElementId, isSalesList = false) => {
        const tableBody = document.getElementById(targetElementId);
        tableBody.innerHTML = '';
        db.products.forEach(product => {
            if (isSalesList) {
                const productCard = document.createElement('div');
                productCard.classList.add('p-3', 'border', 'rounded-lg', 'flex', 'justify-between', 'items-center', 'cursor-pointer', 'hover:bg-gray-100', 'transition', 'duration-150');
                productCard.innerHTML = `
                    <div>
                        <div class="font-medium">${product.name} - ${product.size}</div>
                        <div class="text-sm text-gray-500">R$ ${product.price.toFixed(2)}</div>
                        <div class="text-sm">Estoque: <span class="${product.stock <= 0 ? 'alert-negative' : 'text-gray-700'}">${product.stock}</span></div>
                    </div>
                    <button class="btn btn-sm btn-primary add-to-cart-btn" data-id="${product.id}">Adicionar</button>
                `;
                productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product));
                tableBody.appendChild(productCard);
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-2 px-4">${product.name}</td>
                    <td class="py-2 px-4">${product.size}</td>
                    <td class="py-2 px-4">R$ ${product.price.toFixed(2)}</td>
                    <td class="py-2 px-4"><span class="${product.stock <= 0 ? 'alert-negative' : ''}">${product.stock}</span></td>
                    <td class="py-2 px-4 text-center">
                        <button class="btn btn-sm btn-outline-primary edit-product-btn" data-id="${product.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger delete-product-btn" data-id="${product.id}">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            }
        });
    };

    const renderClients = (filter = '') => {
        const tableBody = document.getElementById('client-table-body');
        const clientSelect = document.getElementById('report-client-select');
        tableBody.innerHTML = '';
        clientSelect.innerHTML = '<option value="">Selecione...</option>';
        const filteredClients = db.clients.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
        filteredClients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4">${client.name}</td>
                <td class="py-2 px-4">${client.email || 'N/A'}</td>
                <td class="py-2 px-4 text-center">
                    <button class="btn btn-sm btn-outline-primary edit-client-btn" data-id="${client.id}">Editar</button>
                    <button class="btn btn-sm btn-outline-danger delete-client-btn" data-id="${client.id}">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);

            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            clientSelect.appendChild(option);
        });
    };

    // --- LÓGICA DO MÓDULO DE PRODUTOS ---
    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productSizeInput = document.getElementById('product-size');
    const productStockInput = document.getElementById('product-stock');
    const productCancelBtn = document.getElementById('product-cancel-btn');

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const product = {
            id: productIdInput.value || Date.now(),
            name: productNameInput.value,
            price: parseFloat(productPriceInput.value),
            size: productSizeInput.value,
            stock: parseInt(productStockInput.value, 10),
        };
        
        if (productIdInput.value) {
            const index = db.products.findIndex(p => p.id == productIdInput.value);
            if (index !== -1) db.products[index] = product;
        } else {
            db.products.push(product);
        }
        saveToLocalStorage();
        productForm.reset();
        productIdInput.value = '';
        productCancelBtn.style.display = 'none';
        renderProducts('product-table-body');
        renderProducts('product-list-sales', true);
    });

    productCancelBtn.addEventListener('click', () => {
        productForm.reset();
        productIdInput.value = '';
        productCancelBtn.style.display = 'none';
    });

    document.getElementById('product-table-body').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-product-btn')) {
            const id = e.target.dataset.id;
            const product = db.products.find(p => p.id == id);
            if (product) {
                productIdInput.value = product.id;
                productNameInput.value = product.name;
                productPriceInput.value = product.price;
                productSizeInput.value = product.size;
                productStockInput.value = product.stock;
                productCancelBtn.style.display = 'inline-block';
                document.getElementById('products-tab').click(); // Volta para a aba de produtos
            }
        }
        if (e.target.classList.contains('delete-product-btn')) {
            const id = e.target.dataset.id;
            db.products = db.products.filter(p => p.id != id);
            saveToLocalStorage();
            renderProducts('product-table-body');
            renderProducts('product-list-sales', true);
        }
    });

    // --- LÓGICA DO MÓDULO DE CLIENTES ---
    const clientForm = document.getElementById('client-form');
    const clientIdInput = document.getElementById('client-id');
    const clientNameInput = document.getElementById('client-name');
    const clientEmailInput = document.getElementById('client-email');
    const clientMeasures = {
        ombro: document.getElementById('medida-ombro'),
        peito: document.getElementById('medida-peito'),
        cintura: document.getElementById('medida-cintura'),
        quadril: document.getElementById('medida-quadril')
    };
    const clientCancelBtn = document.getElementById('client-cancel-btn');

    clientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const client = {
            id: clientIdInput.value || Date.now(),
            name: clientNameInput.value,
            email: clientEmailInput.value,
            measures: {
                ombro: clientMeasures.ombro.value,
                peito: clientMeasures.peito.value,
                cintura: clientMeasures.cintura.value,
                quadril: clientMeasures.quadril.value,
            }
        };

        if (clientIdInput.value) {
            const index = db.clients.findIndex(c => c.id == clientIdInput.value);
            if (index !== -1) db.clients[index] = client;
        } else {
            db.clients.push(client);
        }
        saveToLocalStorage();
        clientForm.reset();
        clientIdInput.value = '';
        clientCancelBtn.style.display = 'none';
        renderClients();
    });

    clientCancelBtn.addEventListener('click', () => {
        clientForm.reset();
        clientIdInput.value = '';
        clientCancelBtn.style.display = 'none';
    });

    document.getElementById('client-table-body').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-client-btn')) {
            const id = e.target.dataset.id;
            const client = db.clients.find(c => c.id == id);
            if (client) {
                clientIdInput.value = client.id;
                clientNameInput.value = client.name;
                clientEmailInput.value = client.email;
                for (const key in client.measures) {
                    if (clientMeasures[key]) {
                        clientMeasures[key].value = client.measures[key];
                    }
                }
                clientCancelBtn.style.display = 'inline-block';
                document.getElementById('clients-tab').click(); // Volta para a aba de clientes
            }
        }
        if (e.target.classList.contains('delete-client-btn')) {
            const id = e.target.dataset.id;
            db.clients = db.clients.filter(c => c.id != id);
            saveToLocalStorage();
            renderClients();
        }
    });

    document.getElementById('client-search').addEventListener('input', (e) => {
        renderClients(e.target.value);
    });

    // --- LÓGICA DO MÓDULO DE VENDAS ---
    const cartList = document.getElementById('cart-list');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const productSearchInput = document.getElementById('product-search');

    const updateCartTotal = () => {
        const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
        checkoutBtn.disabled = currentCart.length === 0;
    };

    const addToCart = (product) => {
        const existingItem = currentCart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            currentCart.push({ ...product, quantity: 1 });
        }
        renderCart();
    };

    const renderCart = () => {
        cartList.innerHTML = '';
        currentCart.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('flex', 'justify-between', 'items-center', 'border-b', 'pb-1');
            li.innerHTML = `
                <span class="text-sm">${item.name} (${item.size}) - Qtd: ${item.quantity}</span>
                <span class="font-medium">R$ ${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartList.appendChild(li);
        });
        updateCartTotal();
    };

    productSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredProducts = db.products.filter(p => p.name.toLowerCase().includes(query) || p.size.toLowerCase().includes(query));
        document.getElementById('product-list-sales').innerHTML = '';
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('p-3', 'border', 'rounded-lg', 'flex', 'justify-between', 'items-center', 'cursor-pointer', 'hover:bg-gray-100', 'transition', 'duration-150');
            productCard.innerHTML = `
                <div>
                    <div class="font-medium">${product.name} - ${product.size}</div>
                    <div class="text-sm text-gray-500">R$ ${product.price.toFixed(2)}</div>
                    <div class="text-sm">Estoque: <span class="${product.stock <= 0 ? 'alert-negative' : 'text-gray-700'}">${product.stock}</span></div>
                </div>
                <button class="btn btn-sm btn-primary add-to-cart-btn" data-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>Adicionar</button>
            `;
            productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product));
            document.getElementById('product-list-sales').appendChild(productCard);
        });
    });

    checkoutBtn.addEventListener('click', () => {
        const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const sale = {
            id: Date.now(),
            date: new Date().toLocaleDateString('pt-BR'),
            items: currentCart,
            total: total,
        };

        // Atualiza o estoque
        currentCart.forEach(cartItem => {
            const product = db.products.find(p => p.id === cartItem.id);
            if (product) {
                product.stock -= cartItem.quantity;
            }
        });

        db.sales.push(sale);
        saveToLocalStorage();

        // Gera e exibe o cupom
        const receiptContent = document.getElementById('receipt-content');
        document.getElementById('receipt-date').textContent = sale.date;
        document.getElementById('receipt-total').textContent = `R$ ${sale.total.toFixed(2)}`;
        const receiptItemsList = document.getElementById('receipt-items');
        receiptItemsList.innerHTML = '';
        sale.items.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `
                <div class="flex justify-between text-sm">
                    <span>${item.name} (${item.size})</span>
                    <span>R$ ${item.price.toFixed(2)} x ${item.quantity}</span>
                </div>
            `;
            receiptItemsList.appendChild(div);
        });

        const receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'));
        receiptModal.show();
        
        // Limpa o carrinho e atualiza a tela
        currentCart = [];
        renderCart();
        renderProducts('product-list-sales', true); // Re-renderiza a lista de produtos com estoque atualizado
    });

    // --- LÓGICA DO MÓDULO DE RELATÓRIOS ---
    const reportClientSelect = document.getElementById('report-client-select');
    const clientReportDetails = document.getElementById('client-report-details');
    const clientDetailsCard = document.getElementById('client-details-card');
    const clientSalesHistory = document.getElementById('client-sales-history');

    reportClientSelect.addEventListener('change', (e) => {
        const clientId = e.target.value;
        if (!clientId) {
            clientReportDetails.classList.add('hidden');
            return;
        }

        clientReportDetails.classList.remove('hidden');
        const client = db.clients.find(c => c.id == clientId);
        if (client) {
            clientDetailsCard.innerHTML = `
                <p><strong>Nome:</strong> ${client.name}</p>
                <p><strong>Email:</strong> ${client.email || 'N/A'}</p>
                <h4 class="font-bold mt-2">Medidas:</h4>
                <ul class="list-disc list-inside">
                    <li>Ombro: ${client.measures.ombro || 'N/A'}</li>
                    <li>Peito: ${client.measures.peito || 'N/A'}</li>
                    <li>Cintura: ${client.measures.cintura || 'N/A'}</li>
                    <li>Quadril: ${client.measures.quadril || 'N/A'}</li>
                </ul>
            `;

            clientSalesHistory.innerHTML = '';
            const clientSales = db.sales.filter(sale => sale.clientId == clientId);
            if (clientSales.length > 0) {
                clientSales.forEach(sale => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="py-2 px-4">${sale.date}</td>
                        <td class="py-2 px-4">${sale.items.map(i => `${i.name} (${i.size})`).join(', ')}</td>
                        <td class="py-2 px-4">R$ ${sale.total.toFixed(2)}</td>
                    `;
                    clientSalesHistory.appendChild(row);
                });
            } else {
                clientSalesHistory.innerHTML = '<tr><td colspan="3" class="text-center py-4">Nenhuma compra encontrada para este cliente.</td></tr>';
            }
        }
    });

    // --- INICIALIZAÇÃO ---
    renderProducts('product-table-body');
    renderProducts('product-list-sales', true);
    renderClients();
});