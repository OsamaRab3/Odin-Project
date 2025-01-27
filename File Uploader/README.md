# File Management System

A full-stack application for secure file and folder management with user authentication.

## Features
- **User Authentication**: Signup/Login with email & password
- **Folder Management**: Create/Delete folders
- **File Operations**: Upload/Delete files within folders
- **Session Management**: Persistent sessions with localStorage (frontend) + session store (backend)
- **Error Handling**: Custom 404 page and API error responses

## Technologies
**Frontend**  
- HTML/CSS
- Vanilla JavaScript
- Ionicons

**Backend**  
- Node.js/Express
- MySQL (via Prisma ORM)
- Multer (file uploads)
- Passport.js (authentication)
- Express-session (session management)

## Installation
1. Clone repository:
```bash
git clone https://github.com/OsamaRab3/Odin-Project
cd File Uploder
```
2. Install dependencies:

```bash
Copy
npm install
```
3. Configure environment (.env)
4. Initialize Prisma:
```bash
npx prisma generate
npx prisma migrate dev
```
5. Start server:
```bash 
npm start
```
---
## API Endpoints

### Authentication
| Method | Endpoint               | Description          | Parameters                   |
|--------|------------------------|----------------------|------------------------------|
| POST   | `/api/user/signup`     | User registration    | `name`, `email`, `password` (request body) |
| POST   | `/api/user/login`      | User login           | `email`, `password` (request body) |

### Folder Operations
| Method | Endpoint                                | Description          | Parameters                   |
|--------|-----------------------------------------|----------------------|------------------------------|
| POST   | `/api/folder/create`                   | Create new folder    | `name` (request body)        |
| GET    | `/api/folder/folders/:userId`          | Get user folders     | `userId` (URL parameter)     |
| DELETE | `/api/folder/delete/:folderId/:userId` | Delete folder        | `folderId`, `userId` (URL parameters) |

### File Operations
| Method | Endpoint                                      | Description          | Parameters                   |
|--------|-----------------------------------------------|----------------------|------------------------------|
| POST   | `/api/file/upload`                           | Upload file          | `file` (form-data), `folderId` (request body) |
| GET    | `/api/file/files/:userId`                    | Get user files       | `userId` (URL parameter)     |
| DELETE | `/api/file/delete/:fileId/:folderId/:userId` | Delete file          | `fileId`, `folderId`, `userId` (URL parameters) |


---

## Frontend Structure
### Pages:
- /index.html: Landing page

- /login.html: User login

- /signup.html: User registration

- /upload.html: File/folder management

- /404NotFound.html: Error page
---


