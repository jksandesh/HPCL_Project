const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

global.Task = require('./api/models/taskModel');
const routes = require('./api/routes/taskRoutes');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.set("useCreateIndex", true);
mongoose.connect(
  'mongodb://127.0.0.1:27017/DLT',
);

const port = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '10mb',extended: false }));
app.use(bodyParser.json({limit: '10mb'}));

routes(app);
app.listen(port);

app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

console.log(`Server started on port ${port}`);