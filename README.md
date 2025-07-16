## 🚀 Chatbox Project

A full-featured chat application backend built with Node.js and TypeScript. This project supports user authentication, real-time messaging, notifications, file uploads, and admin management.

---

### 🔧 Features

* ✅ User registration, login, and authentication (JWT)
* ✅ Real-time chat between users (1:1 & group)
* ✅ Message and notification system
* ✅ Admin panel for user & chat management
* ✅ File/image upload support (e.g., Cloudinary)
* ✅ Password reset & email verification
* ✅ Scalable modular architecture with layered structure

---

### 🛠️ Technologies Used

* **Node.js**
* **TypeScript**
* **Express.js**
* **MongoDB (Mongoose)**
* **Socket.io**
* **Zod** (for schema validation)

---

### ⚙️ Getting Started

#### 📦 Prerequisites

* Node.js (v16+ recommended)
* npm or yarn
* MongoDB instance (local or cloud)

---

#### 📥 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Mohosin075/chatbox.git
   cd chatbox
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env` file** in the root directory with the following content:

   ```env
   # Basic
   NODE_ENV=development
   DATABASE_URL=mongodb://localhost:27017/chatbox
   IP_ADDRESS=localhost
   PORT=5000

   # Bcrypt
   BCRYPT_SALT_ROUNDS=12

   # JWT
   JWT_SECRET=jwt_secret
   JWT_EXPIRE_IN=15d

   # Email
   EMAIL_FROM=web.mohosin@gmail.com
   EMAIL_USER=web.mohosin@gmail.com
   EMAIL_PASS=fffbwegobuoymief
   EMAIL_PORT=587
   EMAIL_HOST=smtp.gmail.com

   # Super Admin (Initial Seeder)
   SUPER_ADMIN_EMAIL=web.mohosin@gmail.com
   SUPER_ADMIN_PASSWORD=12345678
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

---

### 📁 Project Structure

```
src/
﻿�
🔍 app.ts
🔍 server.ts
🔍 gm.ts
🔍 app/
    ├── builder/
    ├── config/
    ├── enums/
    ├── errors/
    ├── helpers/
    ├── middlewares/
    ├── modules/
    ├── routes/
    ├── shared/
    ├── tasks/
    ├── types/
    └── util/
```

---


### 🧰 Scripts

* `yarn` — Install dependencies
* `yarn dev` — Start development server

---

### 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first to discuss what you'd like to improve or add.

