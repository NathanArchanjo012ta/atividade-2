const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, init } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializa DB e tabela
init();

// Servir frontend estático
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rotas API
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products_nathan ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', (req, res) => {
  const { title, category, description, price } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const sql = `INSERT INTO products_nathan (title, category, description, price) VALUES (?,?,?,?)`;
  db.run(sql, [title, category || '', description || '', price || 0], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM products_nathan WHERE id = ?', [this.lastID], (err2, row) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(row);
    });
  });
});

app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM products_nathan WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deletedId: id });
  });
});

app.listen(PORT, () => console.log(`Server rodando em http://localhost:${PORT}`));
