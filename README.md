## Chatbox Project

A full-featured chat application backend built with Node.js and TypeScript. This project supports user authentication, real-time messaging, notifications, file uploads, and admin management.

### Features
- User registration, login, and authentication (JWT)
- Real-time chat between users
- Message and notification management
- Admin panel for user and chat management
- File upload support
- Password reset and email verification
- Modular and scalable code structure

### Technologies Used
- Node.js
- TypeScript
- Express.js
- MongoDB (Mongoose)
- Socket.io
- Zod (validation)
- Stripe (payment integration)

### Getting Started

#### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

#### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Mohosin075/chatbox.git
   cd chatbox
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory based on your configuration needs (MongoDB URI, JWT secret, etc).
4. Run the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```


### Project Structure

```
src/
  app.ts
  server.ts
  gm.ts
  app/
    builder/
    middlewares/
    modules/
    config/
    enums/
    errors/
    helpers/
    routes/
    shared/
    tasks/
    types/
    util/
```

### Scripts
- `yarn`
- `yarn dev` — Start the server in development mode
- `yarn build` — Build the project
- `yarn start` — Start the server in production mode

### Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

