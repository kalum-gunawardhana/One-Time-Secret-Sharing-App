# SecretShare - One-Time Secret Sharing App

A secure application for sharing sensitive information with end-to-end encryption and one-time viewing capabilities.

## Features

- User authentication with JWT and bcrypt password hashing
- Create password-protected, one-time-view secrets
- Generate secure shareable links
- Access logging for security monitoring
- Auto-deletion of secrets after viewing

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT
- **Password Hashing**: bcrypt

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and configure your environment variables:
   ```
   PORT=4000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=secret_sharing_db
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers:
   ```
   npm run dev:all
   ```

## API Endpoints

### Authentication

- `POST /api/signup` - Register a new user
- `POST /api/login` - Login and get JWT token
- `GET /api/me` - Get current user (auth required)

### Secrets

- `POST /api/secret` - Create a new secret (auth required)
- `GET /api/secret/:token` - Check if a secret exists
- `POST /api/secret/:token/view` - View a secret (requires password)

## Security Features

- JWT authentication for API protection
- Password hashing with bcrypt
- One-time view with automatic deletion
- Rate limiting to prevent brute force attacks
- Access logging of all viewing attempts

## License

MIT