# Members Only - Exclusive Clubhouse

Welcome to the **Members Only** project! This is an exclusive clubhouse where members can write anonymous posts. Inside the clubhouse, members can see who the author of a post is, but outside, only the story is visible, leaving others to wonder who wrote it.

This project is built using **Node.js**, **Express**, **Mongoose** (for MongoDB), and **PostgreSQL** for the backend, and **HTML**, **CSS**, and **JavaScript** for the frontend. It’s designed to help you practice authentication, database management, and user permissions.

---

## Features

- **User Authentication**: Sign up, log in, and manage user sessions.
- **Membership Status**: Users can join the club by entering a secret passcode.
- **Anonymous Posts**: Members can create posts with titles, timestamps, and text.
- **Admin Privileges**: Admins can delete posts.
- **Post Visibility**:
  - Non-members can only see the post content.
  - Members can see the author and date of each post.
  - Admins can see everything and delete posts.

---

## Technologies Used

### Backend
- **Node.js**: Runtime environment.
- **Express**: Web framework for building the server.
- **Mongoose**: MongoDB object modeling for Node.js.
- **PostgreSQL**: Relational database for storing user data.
- **Passport.js**: Authentication middleware.
- **Bcrypt**: Password hashing for secure storage.

### Frontend
- **HTML**: Structure of the web pages.
- **CSS**: Styling and layout.
- **JavaScript**: Dynamic behavior and interactivity.

---

## Installation

Follow these steps to set up and run the project locally.

### Prerequisites
- **Node.js** and **npm** installed.
- **MongoDB** and **PostgreSQL** installed and running.
- Basic knowledge of Express, Mongoose, and Passport.js.

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/members-only.git
   cd members-only
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```
   DATABASE_URL=your_postgresql_connection_string
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. **Set up the databases**:
   - Create a PostgreSQL database for user data.
   - Create a MongoDB database for post data.

5. **Run the application**:
   ```bash
   npm start
   ```

6. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

---

## Project Structure

```
members-only/
│
├── models/                # Database models (User, Post)
├── routes/                # Express routes (auth, posts, etc.)
├── views/                 # Frontend templates (HTML)
├── public/                # Static files (CSS, JS)
├── config/                # Configuration files (Passport, DB)
├── .env                   # Environment variables
├── app.js                 # Main application file
└── README.md              # Project documentation
```

---

## Usage

### 1. Sign Up
- Visit the sign-up page and fill in your details:
  - Full name.
  - Email (used as username).
  - Password.
  - Confirm password.

### 2. Log In
- Use your email and password to log in.

### 3. Join the Club
- After logging in, visit the "Join the Club" page.
- Enter the secret passcode to gain membership status.

### 4. Create a Post
- Once a member, you can create a new post with a title and text.

### 5. View Posts
- All users can view posts, but only members can see the author and date.
- Admins can delete posts.

---

## Assignment Steps

### 1. Database Models
- Design the database models for `User` and `Post`.
- Users should have:
  - Full name (first and last).
  - Username (can use email).
  - Password (hashed with bcrypt).
  - Membership status (default: false).
  - Admin status (default: false).
- Posts should have:
  - Title.
  - Timestamp.
  - Text content.
  - Reference to the user who created it.

### 2. Database Setup
- Set up PostgreSQL for user data and MongoDB for posts.
- Generate the project skeleton and implement the models.

### 3. Sign-Up Form
- Create a sign-up form with fields for:
  - Full name.
  - Email (username).
  - Password.
  - Confirm password.
- Validate and sanitize inputs.
- Hash passwords using bcrypt.

### 4. Membership Status
- Add a page where users can join the club by entering a secret passcode.
- Update their membership status if the passcode is correct.

### 5. Login Form
- Implement a login form using Passport.js for authentication.

### 6. Create New Message
- Show a "Create new message" link only to logged-in users.
- Create a form for submitting new messages.

### 7. Display Messages
- Display all messages on the home page.
- Show author and date only to members.

### 8. Admin Privileges
- Add an optional `admin` field to the user model.
- Allow admins to delete posts.
- Add a way to mark users as admins (e.g., secret passcode or checkbox during sign-up).

### 9. Final Touches
- Ensure non-members can only see post content.
- Members can see author and date.
- Admins can see everything and delete posts.

