async function fetchProducts() {
  const res = await fetch('/api/products');
  const data = await res.json();
  return data;
}

function renderList(items) {
  const container = document.getElementById('list');
  if (!items.length) {
    container.innerHTML = '<p>Nenhum produto cadastrado.</p>';
    return;
  }
  const rows = items.map(it => `
    <tr>
      <td>${it.id}</td>
      <td>${escapeHtml(it.title)}</td>
      <td>${escapeHtml(it.category)}</td>
      <td>${escapeHtml(it.description)}</td>
      <td>${it.price}</td>
      <td>${it.created_at}</td>
    </tr>
  `).join('');
  container.innerHTML = `
    <table>
      <thead><tr><th>ID</th><th>Título</th><th>Categoria</th><th>Descrição</th><th>Preço</th><th>Criado</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function escapeHtml(s){
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]; });
}

// Inicialização na página
document.addEventListener('DOMContentLoaded', async () => {
  const items = await fetchProducts();
  renderList(items);
});
