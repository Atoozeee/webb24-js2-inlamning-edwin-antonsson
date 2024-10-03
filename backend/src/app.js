import express from 'express';
import fs from 'fs/promises';
import cors from 'cors'; // Jag får något konstigt error som jag googlade fram denna lösning till. Har försökt att lösa den utan men hittar ingenting... :/

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Se ovan :)

const highscorePath = './src/highscore.json';

app.get('/highscores', (req, res) => {
    fs.readFile(highscorePath, 'utf8')
        .then(data => {
            const scores = JSON.parse(data);
            res.json(scores);
        })
        .catch(() => res.send('Error reading high scores'));
});

app.post('/highscores', (req, res) => {
    const { name, score } = req.body;

    if (!name || !score) {
        return res.send('Name and score are required');
    }

    fs.readFile(highscorePath, 'utf8')
        .then(data => {
            let scores = JSON.parse(data);

            if (scores.length < 5 || score > scores[scores.length - 1].score) {
                scores.push({ name, score });
                scores.sort((a, b) => b.score - a.score); 
                if (scores.length > 5) scores.pop(); 
            }

            return fs.writeFile(highscorePath, JSON.stringify(scores, null, 2));
        })
        .then(() => res.json({ message: 'Highscore updated successfully' }))
        .catch(() => res.send('Error saving high scores'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
