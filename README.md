# backend structure (noSQL)

A scalable Node.js backend for a no-SQL (MongoDB) service marketplace, featuring authentication, user management, service listings, reviews, payments, chat, notifications, and more.

## Features

- **Authentication**: JWT-based login, registration, password reset, and email verification.
- **User Management**: Profile, bookmarks, and role-based access (Admin, User, Provider, Super Admin).
- **Service Listings**: CRUD for services, trending/recommended endpoints, provider-specific views.
- **Reviews**: Add, update, and fetch service reviews.
- **Payments**: Stripe integration for secure payments.
- **Chat & Messaging**: Real-time chat and messaging between users and providers.
- **Notifications**: User and admin notifications.
- **Categories**: Manage service categories with image uploads.
- **File Uploads**: Image uploads for services, categories, and messages.
- **Rate Limiting**: Prevent abuse with configurable rate limits.
- **Logging**: Winston-based logging for errors and successes.
- **Scheduled Tasks**: Cron jobs for periodic tasks.
- **Environment Config**: Centralized config with `.env` support.

## Tech Stack

- Node.js, Express.js
- TypeScript
- MongoDB & Mongoose
- Socket.io (real-time)
- Stripe (payments)
- Cloudinary (file storage)
- Nodemailer (emails)
- Winston (logging)
- ESLint & Prettier (code quality)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance
- Stripe, Cloudinary, and email service credentials

### Installation

```bash
git clone <repo-url>
cd no-sql-project-structure
npm install
```

### Environment Variables

Create a `.env` file in the root directory. Example:

```
PORT=5000
IP_ADDRESS=127.0.0.1
DATABASE_URL=mongodb://localhost:27017/no-sql-project-structure
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRE_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
EMAIL_FROM=your@email.com
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_pass
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_API_SECRET=your_stripe_api_secret
WEBHOOK_SECRET=your_stripe_webhook_secret
SUCCESS_URL=https://yourdomain.com/success
SUPER_ADMIN_EMAIL=admin@email.com
SUPER_ADMIN_PASSWORD=superadminpassword
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_NUMBER=your_twilio_number
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the App

- **Development**:  
  ```bash
  npm run dev
  ```
- **Production**:  
  ```bash
  npm run build
  npm start
  ```

### Linting & Formatting

- Lint: `npm run lint:check`
- Fix: `npm run lint:fix`
- Prettier: `npm run prettier:check` / `npm run prettier:fix`

## API Endpoints

All endpoints are prefixed with `/api/v1`.

- **Auth**: `/auth/login`, `/auth/forget-password`, `/auth/verify-email`, `/auth/reset-password`, `/auth/change-password`
- **Users**: `/user/profile`, `/user/bookmark`, `/user/bookmark/add`, `/user/bookmark/remove`
- **Services**: `/services/`, `/services/recommended`, `/services/trending`, `/services/provider`, `/services/:id`
- **Reviews**: `/reviews/`, `/reviews/:serviceId`, `/reviews/review/:reviewId`
- **Payments**: `/payments/create-stripe-payment`
- **Chat**: `/chats/`
- **Messages**: `/messages/`
- **Notifications**: `/notifications/`, `/notifications/admin`
- **Categories**: `/categories/`, `/categories/:id`

## Folder Structure

```
src/
  app.ts              # Express app setup
  server.ts           # Server entry point
  config/             # Environment/config management
  DB/                 # Database seeders
  app/
    modules/          # Feature modules (auth, user, services, etc.)
    middlewares/      # Express middlewares
    builder/          # (custom code generation, if any)
  routes/             # API route definitions
  shared/             # Shared utilities/helpers
  errors/             # Error handling
  enums/              # Enums for roles, etc.
  helpers/            # Helper functions
  tasks/              # Cron/scheduled tasks
  types/              # TypeScript types
  util/               # Utility functions
uploads/              # Uploaded files
winston/              # Log files
```

## Logging

- Logs are stored in `winston/error/` and `winston/success/`.

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/foo`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

---

Let me know if you want to add project-specific details or usage examples!
