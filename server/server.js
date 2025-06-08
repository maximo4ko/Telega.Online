const express = require('express');
const cors = require('cors');
const { db } = require('./firebase'); // Подключение к Firebase

const app = express();
app.use(cors());
app.use(express.json());

// Регистрация
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();
    if (doc.exists) {
        return res.status(400).json({ error: 'Имя уже занято!' });
    }
    await userRef.set({ username, password, online: true });
    res.json({ success: true });
});

// Вход
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();
    if (!doc.exists || doc.data().password !== password) {
        return res.status(401).json({ error: 'Ошибка входа!' });
    }
    await userRef.update({ online: true });
    res.json({ success: true });
});

app.listen(3000, () => console.log('Сервер запущен!'));
