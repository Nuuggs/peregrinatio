const express = require('express');
const app = express();
require('dotenv').config();

const { PORT } = process.env;

console.log(process.env);
app.get('/', (req, res) => console.log('works!'))

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));