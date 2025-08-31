import express from 'express';
import { config } from 'dotenv';

config(); // load .env

const app = express();
const port = 4000;

app.get('/linkdin', (req, res) => {
  res.send('<h2>Chai Aur Apni Kahni</h2>');
});

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
