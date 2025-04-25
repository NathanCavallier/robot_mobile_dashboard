const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const robotRoute = require('./routes/robotData');

app.use(bodyParser.json());
app.use('/api/robot', robotRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});