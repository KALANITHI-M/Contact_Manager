// Google API Configuration
// To use Google Contacts integration, you need to:
// 1. Go to https://console.developers.google.com/
// 2. Create a new project or select existing one
// 3. Enable the People API
// 4. Create OAuth 2.0 credentials
// 5. Add your domain to authorized origins
// 6. Replace the values below with your actual credentials

export const GOOGLE_CONFIG = {
  CLIENT_ID: '581491459372-hcmdpee5e1qg0e4qn9vhrtmmnmp40qqs.apps.googleusercontent.com',
  API_KEY: 'AIzaSyC5qN9r2-9UZIk6BBvcO_VlzK29cz7K7Ms',
  SCOPES: [
    'https://www.googleapis.com/auth/contacts',
    'https://www.googleapis.com/auth/user.emails.read'
  ],
  DISCOVERY_DOCS: [
    'https://people.googleapis.com/$discovery/rest?version=v1'
  ]
}

// Instructions for setup:
// 1. CLIENT_ID: Found in your OAuth 2.0 client credentials
// 2. API_KEY: Found in your project's API keys section
// 3. Make sure to add your domain (including localhost:5173 for development) to authorized origins
// 4. Enable the People API in your Google Cloud Console

export default GOOGLE_CONFIG
