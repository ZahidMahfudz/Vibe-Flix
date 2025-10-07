const { google } = require('googleapis');

// Tidak perlu dotenv di Vercel, tapi aman untuk development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Tentukan redirect URI berdasarkan environment
const redirectUri =
  process.env.NODE_ENV === 'production'
    ? 'https://vibe-flix-eight.vercel.app/auth/google/callback'
    : 'http://localhost:3000/auth/google/callback';

// Pastikan variabel lingkungan terbaca
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ Missing Google OAuth environment variables');
  console.error('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
  console.error('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
  throw new Error('Google OAuth environment variables are missing');
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  include_granted_scopes: true
});

module.exports = { oauth2Client, authorizationUrl };
