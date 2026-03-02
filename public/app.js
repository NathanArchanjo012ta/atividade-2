async function fetchProducts() {
  const res = await fetch(`${getApiBase()}/api/products`);
  if (!res.ok) throw new Error(`Erro ao carregar produtos (status ${res.status})`);
  return await res.json();
}

async function deleteProduct(id) {
  const res = await fetch(`${getApiBase()}/api/products/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    let message = `Erro ao apagar produto (status ${res.status})`;
    try {
      const err = await res.json();
      if (err && err.error) message = err.error;
    } catch (_) {}
    throw new Error(message);
  }
}

function getApiBase() {
  return window.location.port === '3000' ? '' : 'http://localhost:3000';
}

function renderList(items) {
  const container = document.getElementById('list');
  if (!items.length) {
    container.innerHTML = '<p class="empty">Nenhum produto cadastrado.</p>';
    return;
  }

  const cards = items.map(it => {
    const price = Number(it.price || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    const createdAt = it.created_at
      ? new Date(it.created_at).toLocaleString('pt-BR')
      : '-';

    return `
      <article class="product-card">
        <h3>${escapeHtml(it.title)}</h3>
        <p><strong>ID:</strong> ${it.id}</p>
        <p><strong>Categoria:</strong> ${escapeHtml(it.category) || '-'}</p>
        <p><strong>Descricao:</strong> ${escapeHtml(it.description) || '-'}</p>
        <p><strong>Preco:</strong> ${price}</p>
        <p><strong>Criado:</strong> ${createdAt}</p>
        <button class="delete-button" data-id="${it.id}" type="button">Apagar</button>
      </article>
    `;
  }).join('');

  container.innerHTML = `<div class="products-grid">${cards}</div>`;
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const listEl = document.getElementById('list');

  async function loadProducts() {
    const items = await fetchProducts();
    renderList(items);
  }

  try {
    await loadProducts();
  } catch (error) {
    alert(error.message || 'Erro ao carregar produtos. Verifique se o backend esta rodando em http://localhost:3000.');
  }

  listEl.addEventListener('click', async (event) => {
    const button = event.target.closest('.delete-button');
    if (!button) return;

    const id = button.dataset.id;
    if (!id) return;

    try {
      await deleteProduct(id);
      alert('Produto apagado com sucesso!');
      await loadProducts();
    } catch (error) {
      alert(error.message || 'Erro ao apagar produto.');
    }
  });
});
