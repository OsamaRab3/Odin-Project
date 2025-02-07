# Odin-Book

A social media platform inspired by core features of popular sites. Built with Node.js, Express, and Socket.IO for real-time interactions.


## Features
- User authentication (JWT)
- Post creation, liking, commenting, and sharing
- Real-time updates via Socket.IO
- Group creation and management
- Direct messaging
- Follow/unfollow system

## API Endpoints

### Authentication
| Method | Endpoint   | Description                | Token Required |
|--------|------------|----------------------------|----------------|
| POST   | `/login`   | User login                 | No             |
| POST   | `/signup`  | User registration          | No             |
| GET    | `/auth/google`         | Initiate Google OAuth login          | No             |
| GET    | `/auth/google/callback`| Google OAuth callback handler        | No             |
| GET    | `/api/success`         | Display success auth message         | No             |
| GET    | `/api/fail`            | Display failed auth message          | No             |

### Users
| Method | Endpoint                        | Description                     | Token Required |
|--------|---------------------------------|---------------------------------|----------------|
| GET    | `/users`                        | Get all users                   | Yes            |
| GET    | `/users/:userId`                | Get specific user info          | Yes            |
| POST   | `/users/comment`                | Create a comment                | Yes            |
| PUT    | `/users/:followerId/:followingId` | Toggle follow status            | Yes            |
| DELETE | `/users/:commentId/:userId`     | Delete a comment                | Yes            |

### Posts
| Method | Endpoint                        | Description                     | Token Required |
|--------|---------------------------------|---------------------------------|----------------|
| POST   | `/posts`                        | Create a post                   | Yes            |
| GET    | `/posts`                        | Get all posts                   | Yes            |
| PUT    | `/posts`                        | Update a post                   | Yes            |
| DELETE | `/posts/:postId`                | Delete a post                   | Yes            |
| POST   | `/posts/share`                  | Share a post                    | Yes            |
| PUT    | `/posts/:userId/:itemId/:type`  | Add like to post/comment        | Yes            |
| DELETE | `/posts/:userId/:itemId/:type`  | Remove like from post/comment   | Yes            |

### Messages
| Method | Endpoint        | Description                     | Token Required |
|--------|-----------------|---------------------------------|----------------|
| POST   | `/messages`     | Send a message                  | Yes            |
| GET    | `/messages`     | Get all messages                | Yes            |

### Groups
| Method | Endpoint                        | Description                     | Token Required |
|--------|---------------------------------|---------------------------------|----------------|
| POST   | `/groups`                       | Create a group                  | Yes            |
| GET    | `/groups`                       | Get all groups                  | Yes            |
| POST   | `/groups/post`                  | Create group post               | Yes            |
| DELETE | `/groups/:postId/:groupId/:authorId` | Delete group post    | Yes            |
| GET    | `/groups/:groupId`              | Get group members               | Yes            |
| POST   | `/groups/:userId/:groupId`      | Add member to group             | Yes            |

---

## Socket.IO Events
Real-time updates for the following actions:
- **Likes**: `addLike`, `removeLike`
- **Posts**: `newPost`, `deletePost`, `updatePost`
- **Comments**: `newComment`, `deleteComment`
- **Groups**: `createGroup`, `addToGroup`, `groupPost`
- **Chat**: `sendMessage`
- **Follows**: `followToggle`

---

## Database & ORM


- Database: MySQL

- ORM: Prisma (for simplified database management and queries)

- Migrations: Managed via Prisma schema
  
### DB Design 
![](/image-1.png)

## Authentication

- Passport.js Local Strategy for username-password authentication

- Google OAuth2 for social login integration

- JWT for secure API authentication

