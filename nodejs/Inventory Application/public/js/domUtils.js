// DOM manipulation utilities
export function renderBooksList(books, container) {
    if (!Array.isArray(books) || books.length === 0) {
        container.innerHTML = '<li class="error">No books available</li>';
        return;
    }

    container.innerHTML = books.map(book => `
        <li class="book-item">
            <h3>${book.name}</h3>
            <p class="author">Author: ${book.author_name}</p>
            <p class="price">$${book.price}</p>
            <p class="description">${book.description}</p>
        </li>
    `).join('');
}

export function showError(container, message) {
    container.innerHTML = `<li class="error">Failed to load books: ${message}</li>`;
}

export function showMessage(message) {
    alert(message);
}