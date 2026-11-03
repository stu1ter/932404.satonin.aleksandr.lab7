const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE = "db.sqlite";

// Подключение к базе данных SQLite
const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        console.error('Ошибка подключения к БД:', err.message);
        throw err;
    } else {
        console.log('Успешное подключение к SQLite.');

        // Создание таблицы articles
        db.run(`CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            is_published BOOLEAN DEFAULT 0,
            published_at TEXT
        )`, (err) => {
            if (err) {
                console.error('Ошибка создания таблицы:', err.message);
            } else {
                console.log('Таблица articles готова к работе.');
            }
        });
    }
});

module.exports = db;
