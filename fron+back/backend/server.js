import express from 'express';

const app = express();

const jokes = [
  { id: 1, joke: "Why did the developer go broke? Because he used up all his cache." },
  { id: 2, joke: "Why do programmers prefer dark mode? Because light attracts bugs!" },
  { id: 3, joke: "Collages are just waste of money and time🥲🥲"}
];

app.get('/api/jokes', (req, res) => {
  res.json(jokes);
});


const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
