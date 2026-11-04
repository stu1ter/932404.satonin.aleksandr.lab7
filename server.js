const express = require('express');
const ArticlesModel = require('./db_crud');

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. GET /api/articles - Получение списка статей
app.get('/api/articles', (req, res) => {
    const publishedQuery = req.query.published;

    ArticlesModel.getAllArticles(publishedQuery, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            status: "success",
            data: rows
        });
    });
});

// 2. POST /api/articles - Создание статьи (черновика)
app.post('/api/articles', (req, res) => {
    const { title, content } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Поле 'title' обязательно для заполнения" });
    }

    ArticlesModel.createArticle(title, content, (err, lastID) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            status: "success",
            message: "Статья успешно создана как черновик",
            articleId: lastID
        });
    });
});

// 3. PUT /api/articles/:id - Публикация статьи
app.put('/api/articles/:id', (req, res) => {
    const id = req.params.id;

    ArticlesModel.publishArticle(id, (err, changes) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (changes === 0) {
            return res.status(404).json({ error: "Статья с таким ID не найдена" });
        }
        res.json({
            status: "success",
            message: `Статья с ID ${id} успешно опубликована`
        });
    });
});

// 4. DELETE /api/articles/:id - Удаление статьи
app.delete('/api/articles/:id', (req, res) => {
    const id = req.params.id;

    ArticlesModel.deleteArticle(id, (err, changes) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (changes === 0) {
            return res.status(404).json({ error: "Статья с таким ID не найдена" });
        }
        res.json({
            status: "success",
            message: `Статья с ID ${id} удалена`
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
