const express = require('express');
const app = express();
const port = 3000;

const articleRouter = require('./routes/articleRouter');
const videoRouter = require('./routes/videoRouter');

app.use('/articles', articleRouter);
app.use('/videos', videoRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})