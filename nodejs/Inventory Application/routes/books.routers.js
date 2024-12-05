const express = require('express')
const bookController = require('../controllers/Books.controllers');
const { resolveInclude } = require('ejs');
const router = express.Router();



router.route('/')
    .get(bookController.getBooks)

router.route('/:id')
    .get(bookController.getBookById)


router.route('/addBook')
    .post(bookController.addBook)


router.route('/deleteBook/:id')
    .delete(bookController.DeleteBook)


module.exports = router;