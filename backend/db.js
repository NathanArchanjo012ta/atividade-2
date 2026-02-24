const path = require('path');
const sqlite3 = require('sqlite3');

const DB_PATH = path.join(__dirname, 'web_03mc.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao abrir DB', err);
    process.exit(1);
  }
});

const init = () => {
  // Cria tabela com o nome sugerido (pode alterar o sufixo para seu nome)
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS products_nathan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      price REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.run(createTableSQL, (err) => {
    if (err) console.error('Erro criando tabela', err);
  });
};

module.exports = { db, init };
