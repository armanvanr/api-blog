const express = require('express');
const app = express();
const postRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');
const port = 3000;

const connect = require("./schemas");
connect();

app.use(express.json());

app.use('/api', [postRouter], [commentRouter]);

app.listen(process.env.PORT || 5000, () => { console.log(port, 'Server is open with port!'); });