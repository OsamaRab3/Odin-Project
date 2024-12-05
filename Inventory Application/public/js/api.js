// API endpoints and fetch functions
const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchBooks() {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}

export async function addBook(bookData) {
    const response = await fetch(`${API_BASE_URL}/books/addBook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
    });
    return response.json();
}

export async function deleteBook(bookId) {
    const response = await fetch(`${API_BASE_URL}/books/deleteBook/${bookId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}