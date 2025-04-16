const {  Author, Work, Book } = require('../db/models');
const axios = require('axios');

const initDb = async (req, res) => {
    try {
        console.log('Initializing DB...');

        const isbnList = [
            "9780140328721", "9780261103573", "9780439139601", "9780385472579", 
            "9780307277671", "9780451524935", "9780743273565", "9780061120084", 
            "9780375831003", "9780525440987", "9780446310789"
        ];
        const baseUrl  = `https://openlibrary.org`;
        for (const isbn of isbnList) {
            console.log('------------ISBN-----------:', isbn);
            
            const bookUrl = `${baseUrl}/isbn/${isbn}`;
            const res = await axios.get(bookUrl);
            
            let authorId;
            let workId;

            if(res.data.authors) {
                const authorUrl = `${baseUrl}${res.data.authors[0].key}`
                const authorRes = await axios.get(authorUrl);

                const [author, created] = await Author.findOrCreate({
                    where: { key: res.data.authors[0].key },
                    defaults: {
                        name: authorRes?.data?.name,
                        bio: authorRes?.data?.bio?.value ? authorRes?.data?.bio?.value : authorRes?.data?.bio
                    },
                });
                authorId = author.id;
            }
            else authorId = null;

            if(res.data.works) {
                const workUrl = `${baseUrl}${res.data.works[0].key}`
                const workRes = await axios.get(workUrl);

                const [work, created] = await Work.findOrCreate({
                    where: { key: res.data.works[0].key },
                    defaults: {
                        title: workRes?.data?.title,
                        description: workRes?.data?.description,
                        description: workRes?.data?.description?.value ? workRes?.data?.description?.value : workRes?.data?.description

                    },
                });
                workId = work.id;
            }
            else workId = null;


            let obj = {
                key: res.data.key,
                title: res.data.title,
                isbn10: res.data?.isbn_10 ? parseInt(res.data?.isbn_10[0]) : null,
                isbn13: res.data?.isbn_13 ? parseInt(res.data?.isbn_13[0]) : null,
                pages: res.data.number_of_pages,
                publisher: res.data?.publishers[0],
                author_id: authorId,
                work_id: workId
            }
            
            const book = await Book.create(obj);

            console.log('Create book: ', book);
            

        }
        console.log('DB has been initialized');

        res.send({ message: 'DB has been initialized' });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send({ error: 'Failed to fetch data' });
    }
}

module.exports = {
    initDb,
}