const express = require('express');
const router = express.Router();
const book = require('../controllers/book');

// Endpoint to get all Books from DB
router.get('/', book.getAllBooks);

// Endpoints to CRUD books 
router.post('/', book.createBook);
router.get('/:id', book.getBookById);
router.put('/:id', book.updateBook);
router.delete('/:id', book.deleteBook);



module.exports = router;
