const {  Author, Work, Book } = require('../db/models');

const axios = require('axios');


const getAllBooks = async (req, res) => {
    try {
      const books = await Book.findAll({
        include: ['Author', 'Work'],
        attributes: { exclude: ['work_id', 'author_id'] },
      });
      
      res.json({books, numOfBooks: books?.length});
    } catch (error) {
      console.error('Error fetching books:', error.message);
      res.status(500).json({ error: 'Failed to fetch books.' });
    }
}


const createBook = async (req, res) => {
  try {
    
    const key = req.body.key;

    const baseUrl  = `https://openlibrary.org`;
    const bookUrl = `${baseUrl}/books/${key}`;

    const bookRes = await axios.get(bookUrl);
    
    console.log('res: ', res.data);
    
    let authorId;
    let workId;
    
    if(bookRes.data.authors) {
        const authorUrl = `${baseUrl}${bookRes.data.authors[0].key}`
        const authorRes = await axios.get(authorUrl);
    
        const [author, created] = await Author.findOrCreate({
            where: { key: bookRes.data.authors[0].key },
            defaults: {
                name: authorRes?.data?.name,
                bio: authorRes?.data?.bio?.value ? authorRes?.data?.bio?.value : authorRes?.data?.bio
            },
        });
        authorId = author.id;
    }
    else authorId = null;
    
    if(bookRes.data.works) {
        const workUrl = `${baseUrl}${bookRes.data.works[0].key}`
        const workRes = await axios.get(workUrl);
    
        const [work, created] = await Work.findOrCreate({
             where: { key: bookRes.data.works[0].key },
            defaults: {
                title: workRes?.data?.title,
                description: workRes?.data?.description,
                description: workRes?.data?.description?.value ? workRes?.data?.description?.value : workRes?.data?.descriptio
             },
        });
        workId = work.id;
        }
    else workId = null;
    
    
    let obj = {
        key: bookRes.data.key,
        title: bookRes.data.title,
        isbn10: bookRes.data?.isbn_10 ? parseInt(bookRes.data?.isbn_10[0]) : null,
        isbn13: bookRes.data?.isbn_13 ? parseInt(bookRes.data?.isbn_13[0]) : null,
        pages: bookRes.data.number_of_pages,
        publisher: bookRes.data?.publishers[0],
        author_id: authorId,
        work_id: workId
    }
                
    const newBook = await Book.create(obj);
    
    console.log('Create book: ', newBook);

    res.status(201).json(newBook);


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookById = async (req, res) => {
  try {

    const key = `/books/${req.params.id}`
    const book = await Book.findOne({
        include: ['Author', 'Work'],
        attributes: { exclude: ['work_id', 'author_id'] },
        where: {
            key: key,
        },
    })
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
    
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ error: 'Failed to fetch books.' });
  }
}

const updateBook = async (req, res) => {
    try {
        
        const key = `/books/${req.params.id}`
        const book = await Book.findOne({
            include: ['Author', 'Work'],
            attributes: { exclude: ['work_id', 'author_id'] },
            where: {
                key: key,
            },
        })
        
        if (!book) return res.status(404).json({ error: 'Book not found' });

        console.log('body: ', req.body);
        
        const { title, isbn10, isbn13, pages, publisher } = req.body;
        await book.update({ title, isbn10, isbn13, pages, publisher });
        res.json(book);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const deleteBook = async (req, res) => {
    try {

        const key = `/books/${req.params.id}`
        const book = await Book.findOne({
            include: ['Author', 'Work'],
            attributes: { exclude: ['work_id', 'author_id'] },
            where: {
                key: key,
            },
        })
        if (!book) return res.status(404).json({ error: 'Book not found' });
        console.log(book);
        
        await book.destroy();
        res.json({ message: 'Book deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };



module.exports = {
    getAllBooks,
    createBook,
    getBookById,
    updateBook,
    deleteBook,
}