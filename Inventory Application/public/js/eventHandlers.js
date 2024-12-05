// Event handlers for forms
import { addBook, deleteBook } from './api.js';
import { showMessage } from './domUtils.js';

export function setupAddBookForm(formElement) {
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newBook = {
            name: document.getElementById('book-name').value,
            author_name: document.getElementById('author-name').value,
            price: document.getElementById('book-price').value,
            description: document.getElementById('book-description').value
        };

        try {
            const data = await addBook(newBook);
            if (data.status === 'success') {
                showMessage('Book added successfully');
                location.reload();
            } else {
                showMessage('Failed to add book');
            }
        } catch (error) {
            console.error("Error adding book:", error);
            showMessage('Failed to add book');
        }
    });
}

export function setupDeleteBookForm(formElement) {
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const bookId = document.getElementById('book-id').value;
        try {
            const data = await deleteBook(bookId);
            if (data.status === 'success') {
                showMessage('Book deleted successfully');
                window.location.href = 'index.html';
            } else {
                showMessage('Failed to delete book');
            }
        } catch (error) {
            console.error("Error deleting book:", error);
            showMessage('Failed to delete book');
        }
    });
}