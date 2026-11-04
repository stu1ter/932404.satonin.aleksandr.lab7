const db = require('./database');

const ArticlesModel = {
    // Получение всех статей с фильтрацией по публикации и сортировкой
    getAllArticles: (publishedQuery, callback) => {
        let sql = "SELECT * FROM articles";
        const params = [];

        if (publishedQuery === 'true') {
            sql += " WHERE is_published = 1";
        }

        // Сначала идут опубликованные по убыванию даты, затем черновики
        sql += " ORDER BY published_at DESC, id DESC";
        db.all(sql, params, (err, rows) => {
            callback(err, rows);
        });
    },

    // Создание новой статьи (черновика)
    createArticle: (title, content, callback) => {
        const sql = 'INSERT INTO articles (title, content, is_published, published_at) VALUES (?, ?, 0, NULL)';
        db.run(sql, [title, content], function (err) {
            callback(err, this ? this.lastID : null);
        });
    },

    // Обновление (Публикация статьи)
    publishArticle: (id, callback) => {
        const sql = `UPDATE articles SET
                     is_published = 1,
                     published_at = datetime('now')
                     WHERE id = ?`;
        db.run(sql, [id], function (err) {
            callback(err, this ? this.changes : null);
        });
    },

    // Удаление статьи
    deleteArticle: (id, callback) => {
        const sql = 'DELETE FROM articles WHERE id = ?';
        db.run(sql, [id], function (err) {
            callback(err, this ? this.changes : null);
        });
    }
};

module.exports = ArticlesModel;
