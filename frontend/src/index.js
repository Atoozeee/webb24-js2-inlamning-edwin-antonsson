const guessForm = document.querySelector("form");
const numberInput = document.querySelector("#numberInput");
const resultDisplay = document.querySelector("#result");
const scoreDisplay = document.querySelector("#score");
const highscoreList = document.querySelector("#highscoreList");
const nameInput = document.querySelector("#nameInput");

let score = 0;
let randomNumber = Math.floor(Math.random() * 3) + 1;
console.log(randomNumber);

function updateHighscores() {
    fetch('http://localhost:3000/highscores')
        .then(res => res.json())
        .then(data => {
            highscoreList.innerHTML = '';
            data.forEach((item, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${item.name} - ${item.score}`;
                highscoreList.appendChild(listItem);
            });
        });
}

guessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const guess = parseInt(numberInput.value);

    if (guess === randomNumber) {
        score++;
        resultDisplay.textContent = 'Correct! Guess again.';
        randomNumber = Math.floor(Math.random() * 3) + 1;
        console.log(randomNumber + ' is the new number.');
    } else {
        resultDisplay.textContent = 'Wrong guess!';

        if (score > 0) {
            fetch('http://localhost:3000/highscores')
                .then(res => res.json())
                .then(highscores => {
                    const lowestScore = highscores.length === 5 ? highscores[4].score : 0;
                    if (score > lowestScore) {
                        fetch('http://localhost:3000/highscores', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ name: nameInput.value, score })
                        })
                        .then(() => {
                            updateHighscores();
                            resultDisplay.textContent = `Your score of ${score} was high enough to get on the leaderboard!`;
                        });
                    } else {
                        resultDisplay.textContent = `Your score of ${score} was not high enough for the leaderboard.`;
                    }

                    score = 0;
                    scoreDisplay.textContent = `Current score: ${score}`;
                });
        }
    }

    scoreDisplay.textContent = `Current score: ${score}`;
    numberInput.value = '';
});

updateHighscores();
