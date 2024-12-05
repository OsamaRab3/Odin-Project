// Main application logic
import { fetchBooks } from './api.js';
import { renderBooksList, showError } from './domUtils.js';
import { setupAddBookForm, setupDeleteBookForm } from './eventHandlers.js';

document.addEventListener("DOMContentLoaded", async function() {
    // Setup books list if we're on the main page
    const booksList = document.getElementById('books-list');
    if (booksList) {
        try {
            const data = await fetchBooks();
            renderBooksList(data.data.books, booksList);
        } catch (error) {
            console.error("Error fetching books:", error);
            showError(booksList, error.message);
        }
    }

    
    const addBookForm = document.getElementById('add-book-form');
    if (addBookForm) {
        setupAddBookForm(addBookForm);
    }

 
    const deleteBookForm = document.getElementById('delete-book-form');
    if (deleteBookForm) {
        setupDeleteBookForm(deleteBookForm);
    }
});