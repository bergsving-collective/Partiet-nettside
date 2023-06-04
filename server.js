const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/getArticles', (req, res) => {
    const articlesDir = path.join(__dirname, 'artikler');
    fs.readdir(articlesDir, (err, files) => {
        if (err) {
            console.error('Error reading article directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const articleFiles = files.filter(file => file.endsWith('.html') && file !== 'index.html');
        res.json(articleFiles);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
