const express = require('express');
const initRouter = require('./routes/init');
const bookRouter = require('./routes/book');
const app = express()

app.use(express.json())

app.use('/initDb', initRouter);
app.use('/api/books', bookRouter);

const port = 3000

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})