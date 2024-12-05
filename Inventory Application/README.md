# Book Inventory Management System

A full-stack web application for managing a book inventory system, built with Node.js, Express, MySQL, and vanilla JavaScript.

## Features

- View all books in the inventory
- Add new books to the inventory
- Delete books from the inventory
- RESTful API architecture
- Clean and responsive user interface

## Project Structure

```
├── controllers/
│   └── Books.controllers.js    # Book-related controller logic
├── database/
│   └── data.js                # Database connection and queries
├── public/
│   ├── css/
│   │   └── styles.css         
│   ├── js/
│   │   ├── api.js            # API interaction functions
│   │   ├── domUtils.js       # DOM manipulation utilities
│   │   ├── eventHandlers.js  # Event handling 
│   │   └── index.js          # Main application l
│   ├── addbook.html          # Add book page
│   ├── deletebook.html       # Delete book page
│   └── index.html            # Main page
├── routes/
│   └── books.routers.js      # API route definitions
├── utils/
│   └── httpStatus.js         # HTTP status constants
├── .env                      # Environment variables
├── index.js                  # Server entry point
└── package.json             # Project dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)



## Database Setup

1. Create a MySQL database
2. Create a Books table with the following structure:

```sql
CREATE TABLE Books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);
```

## Installation

1. Clone the repository:
```bash
git https://github.com/OsamaRab3/Odin-Project 

cd nodejs/Inventory Application
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:8080`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/books | Get all books |
| GET | /api/books/:id | Get a specific book |
| POST | /api/books/addBook | Add a new book |
| DELETE | /api/books/deleteBook/:id | Delete a book |

## Request/Response Examples

### Get All Books
```json
GET /api/books
Response:
{
    "status": "success",
    "data": {
        "books": [
            {
                "id": 1,
                "name": "Book Title",
                "author_name": "Author Name",
                "description": "Book Description",
                "price": 29.99
            }
        ]
    }
}
```

### Add New Book
```json
POST /api/books/addBook
Request Body:
{
    "name": "New Book",
    "author_name": "Author Name",
    "description": "Book Description",
    "price": 19.99
}
```

## Error Handling

The application includes comprehensive error handling for:
- Database connection issues
- Invalid requests
- Missing resources
- Server errors

