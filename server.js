const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/getArticles', async (req, res) => {
    try {
        const articlesDir = path.join(__dirname, 'artikler', 'json');
        const articleFiles = await fs.readdir(articlesDir);

        res.json(articleFiles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/artikler/:id', async (req, res) => {
    const articleId = req.params.id;

    try {
        const filePath = path.join(__dirname, 'artikler', 'json', `${articleId}.json`);
        const data = await fs.readFile(filePath, 'utf8');
        const article = JSON.parse(data);

        const publishDate = new Date(article.datetime).toLocaleDateString('nb-NO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        const htmlTemplate = await fs.readFile(path.join(__dirname, 'template.html'), 'utf8');

        const renderedHtml = htmlTemplate
            .replace(/\[TITLE\]/g, article.title)
            .replace('[SUBTITLE]', article.subtitle)
            .replace('[IMAGE_URL]', article.image)
            .replace('[IMAGE_DESCRIPTION]', article.imageDescription)
            .replace('[IMAGE_CREDIT]', article.imageCredit)
            .replace('[CONTENT]', article.content)
            .replace('[DATETIME]', publishDate);

        res.send(renderedHtml);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/searchArticles', async (req, res) => {
    const searchTerm = req.query.term.toLowerCase();

    try {
        const articlesDir = path.join(__dirname, 'artikler', 'json');
        const articleFiles = await fs.readdir(articlesDir);

        const matchingFiles = [];

        for (const file of articleFiles) {
            const filePath = path.join(__dirname, 'artikler', 'json', file);
            const data = await fs.readFile(filePath, 'utf8');
            const article = JSON.parse(data);

            if (article.title.toLowerCase().includes(searchTerm) || article.content.toLowerCase().includes(searchTerm)) {
                matchingFiles.push(file);
            }
        }

        res.json(matchingFiles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
