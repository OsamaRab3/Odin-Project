const { getallbooks, getonebook, addNewBook, deleteBook } = require('../database/data');
const httpStatus = require('../utils/httpStatus')

const getBooks = async (req, res) => {

  try {
    const books = await getallbooks();
    res.json({ status: httpStatus.SUCCESS, data: { books } })
  }
  catch (err) {
    res.status(500).json({ status: httpStatus.ERROR, message: err.message })

  }

}



const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await getonebook(bookId);
    if (book) {
      res.json({ status: httpStatus.SUCCESS, data: { book } })
    } else {
      res.status(404).json({ status: httpStatus.FAIL, data: null });
    }

  }
  catch (err) {
    console.error(error.message);
    res.status(500).json({ status: httpStatus.ERROR, message: err.message });
  }

}


const addBook = async (req, res) => {
  try {
    const newBook = await addNewBook(req);

    res.status(201).json({ status: httpStatus.SUCCESS, data: { newBook } })
  }
  catch (err) {

    res.status(500).json({ status: httpStatus.ERROR, message: err.message })
  }
};

const DeleteBook = async function (req, res) {
  try {
    const result = await deleteBook(req);

    if (result.success) {
      res.json({ status: httpStatus.SUCCESS, data: null })
    } else {

      res.jsn({ status: httpStatus.FAIL, data: null })

    }
  } catch (err) {
    
    res.status(500).json({ status: httpStatus.ERROR, message: err.message })
  }
};


module.exports = {
  getBooks,
  getBookById,
  addBook,
  DeleteBook
};
