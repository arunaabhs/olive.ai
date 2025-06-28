# Olive Code Editor

A modern, browser-based code editor with AI assistance and real-time collaboration features.

## Features

- 🚀 **Modern Code Editor**: Monaco Editor with syntax highlighting and IntelliSense
- 🤖 **AI Copilot**: Integrated AI assistant for code suggestions and explanations
- 🔐 **Email Authentication**: Secure sign-up/sign-in with Gmail verification
- 💻 **Terminal Integration**: Built-in terminal for running commands
- 📁 **File Explorer**: Intuitive file management system
- 🎨 **Beautiful UI**: Clean, minimalistic design with smooth animations

## Authentication Setup

To enable email verification with Gmail, you need to set up Gmail API credentials:

### 1. Create Gmail API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins

### 2. Configure Environment Variables

Update the `.env` file with your Gmail API credentials:

```env
# Gmail API Configuration
GMAIL_CLIENT_ID=your_gmail_client_id_here
GMAIL_CLIENT_SECRET=your_gmail_client_secret_here
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token_here
GMAIL_ACCESS_TOKEN=your_gmail_access_token_here

# JWT Secret for authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:5173/api
```

### 3. Update Email Address

In `functions/auth.js`, replace `your-email@gmail.com` with your actual Gmail address:

```javascript
// Line 15 and 35
user: 'your-actual-email@gmail.com',
from: '"Olive Code Editor" <your-actual-email@gmail.com>',
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Fill in your Gmail API credentials
   - Generate a secure JWT secret

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173`

## Authentication Flow

1. **Sign Up**: User enters email and password
2. **Email Verification**: 6-digit code sent to user's Gmail
3. **Account Activation**: User enters code to verify email
4. **Sign In**: Authenticated users can access full features

## API Endpoints

- `POST /functions/auth/signup` - Create new account
- `POST /functions/auth/signin` - Sign in to existing account
- `POST /functions/auth/verify` - Verify email with code
- `POST /functions/auth/resend` - Resend verification code

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Email verification required
- ✅ Secure session management
- ✅ CORS protection

## Development

The application uses:
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **Nodemailer** for email sending
- **JWT** for authentication

## Production Deployment

1. Set up production Gmail API credentials
2. Configure secure JWT secret
3. Update CORS origins for your domain
4. Deploy to your preferred hosting platform

## Support

For issues with Gmail API setup, refer to:
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)