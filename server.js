const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

// Serve static files (CSS, JS, images, etc.) from the root folder
app.use(express.static(path.join(__dirname)));

app.get('/artikler/:id', async (req, res) => {
    const articleId = req.params.id;

    try {
        // Read the JSON file corresponding to the article ID
        const filePath = path.join(__dirname, 'artikler', 'json', `${articleId}.json`);
        const data = await fs.readFile(filePath, 'utf8');
        const article = JSON.parse(data);

        // Format the datetime to a human-readable format (Norwegian)
        const publishDate = new Date(article.datetime).toLocaleDateString('nb-NO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        // Render the HTML template with the article data
        const htmlTemplate = await fs.readFile(path.join(__dirname, 'template.html'), 'utf8');

        const renderedHtml = htmlTemplate
            .replace(/\[TITLE\]/g, article.title)
            .replace('[SUBTITLE]', article.subtitle)
            .replace('[IMAGE_URL]', article.image)
            .replace('[IMAGE_DESCRIPTION]', article.imageDescription)
            .replace('[IMAGE_CREDIT]', article.imageCredit)
            .replace('[CONTENT]', article.content)
            .replace('[DATETIME]', publishDate); // Use the formatted date

        res.send(renderedHtml);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
