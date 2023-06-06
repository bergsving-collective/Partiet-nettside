const express = require('express');
const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');

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
    const searchTerm = req.query.term; // Changed 'query' to 'term'

    const articlesDir = path.join(__dirname, 'artikler');
    fs.readdir(articlesDir, (err, files) => {
        if (err) {
            console.error('Error reading article directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const articleFiles = files.filter(file => file.endsWith('.html') && file !== 'index.html');

        const searchResults = [];

        articleFiles.forEach(file => {
            const filePath = path.join(articlesDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            const { document } = new JSDOM(fileContent).window;

            const titleElement = document.querySelector('h1');
            const subtitleElement = document.querySelector('h2');
            const contentElement = document.querySelector('.article-text');
            const imageElement = document.querySelector('img');

            const title = titleElement ? titleElement.textContent : '';
            const subtitle = subtitleElement ? subtitleElement.textContent : '';
            const content = contentElement ? contentElement.innerHTML.replace(/^<p>|<\/p>$/g, '') : '';
            const imageUrl = imageElement ? imageElement.src : '';

            if (
                title.toLowerCase().includes(searchTerm.toLowerCase()) || // Changed 'searchQuery' to 'searchTerm'
                subtitle.toLowerCase().includes(searchTerm.toLowerCase()) || // Changed 'searchQuery' to 'searchTerm'
                content.toLowerCase().includes(searchTerm.toLowerCase()) // Changed 'searchQuery' to 'searchTerm'
            ) {
                searchResults.push({
                    file,
                    title,
                    subtitle,
                    content,
                    imageUrl
                });
            }
        });

        res.json(searchResults);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
