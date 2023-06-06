const express = require('express');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

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

app.get('/searchArticles', (req, res) => {
    const keyword = req.query.keyword;

    if (!keyword) {
        res.json([]);
        return;
    }

    const articlesDir = path.join(__dirname, 'artikler');
    fs.readdir(articlesDir, (err, files) => {
        if (err) {
            console.error('Error reading article directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const searchResults = [];

        files.forEach(file => {
            if (file.endsWith('.html') && file !== 'index.html') {
                const filePath = path.join(articlesDir, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const $ = cheerio.load(fileContent);

                const articleText = $('h1, h2, p').text();
                if (articleText.toLowerCase().includes(keyword.toLowerCase())) {
                    searchResults.push({
                        file: file,
                        matches: [file, $('h2').text()]
                    });
                }
            }
        });

        res.json(searchResults);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
