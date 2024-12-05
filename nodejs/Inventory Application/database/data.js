require('dotenv').config();

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
}).promise();


const getallbooks = async function () {
    try {
        const [rows] = await connection.query(`SELECT * FROM Books`);
        console.log('allbooks: ', rows)
        return rows;
    } catch (error) {
        console.error("Cannot retrieve books", { error });
        return [];
    }
};


const getonebook = async function (bookId) {

    try {
        const [row] = await connection.query('SELECT * FROM Books WHERE id = ?', [bookId]);
        if (row.length > 0) {
            return row[0];
        }
        return null;

    } catch (error) {
        console.error("Cannot retrieve the book", { error });
        return null;
    }
};


const addNewBook = async function (req) {
    const { name, author_name, description, price } = req.body;
    console.log(req.body);
    try {
        const [result] = await connection.query(
            `INSERT INTO Books (name, author_name,description, price) VALUES (?, ?, ?,?)`,
            [name, author_name, description, price]
        );
        return result;
    } catch (error) {
        console.error("Cannot add the book", { error });
        return null;
    }
};


const deleteBook = async function (req) {
    const bookId = req.params.id;


    try {
        const [result] = await connection.query(`DELETE FROM Books WHERE id = ?`, [bookId]);

        if (result.affectedRows === 0) {
            return { success: false, message: 'No rows deleted, book might not exist' };
        }

        return { success: true };
    } catch (error) {
        console.error("Error deleting book", error);
        return { success: false, message: 'Error deleting book' };
    }
};



module.exports = { connection, getallbooks, getonebook, addNewBook, deleteBook };
