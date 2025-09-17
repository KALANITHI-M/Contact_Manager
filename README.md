# Contact Manager Web App

A modern, responsive contact management web application built with React, Vite, and Tailwind CSS. Features include contact management, call history, and Google Contacts integration.

## Features

- ✅ **Contact Management**: Add, edit, delete, and search contacts
- ✅ **Call History**: Track incoming, outgoing, and missed calls
- ✅ **Photo Upload**: Upload and manage contact photos
- ✅ **Favorites**: Mark and organize favorite contacts
- ✅ **A-Z Index**: Quick navigation through contacts
- ✅ **Google Contacts Integration**: Sync contacts with Google
- ✅ **vCard Export**: Download contacts for import to other devices
- ✅ **Mobile-First Design**: Optimized for mobile and desktop
- ✅ **Dark Theme**: Modern dark UI with smooth animations

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Google Contacts Integration Setup

To enable Google Contacts integration, follow these steps:

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the **People API** for your project

### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application** as the application type
4. Add authorized origins:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)
5. Copy the **Client ID**

### 3. Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the **API Key**

### 4. Update Configuration

1. Open `src/config/google.js`
2. Replace the placeholder values:

```javascript
export const GOOGLE_CONFIG = {
  CLIENT_ID: '123456789-abcdef.apps.googleusercontent.com', // Your actual Client ID
  API_KEY: 'AIzaSyC...', // Your actual API Key
  // ... rest of config
}
```

### 5. Test Integration

1. Restart your development server
2. Try adding a new contact
3. Select "Google Contacts" as the save target
4. Sign in with your Google account when prompted

## Troubleshooting

### Outgoing Calls Not Working

**Issue**: Clicking call buttons doesn't initiate calls

**Solutions**:

1. **Mobile Devices**: 
   - Ensure you're using HTTPS or localhost
   - The `tel:` protocol should work automatically
   - Check if your browser supports the protocol

2. **Desktop Browsers**:
   - Most desktop browsers don't support `tel:` protocol
   - The app will show a fallback message with the phone number
   - Use your phone's dialer or a VoIP service

3. **Browser Compatibility**:
   - Chrome/Edge: Full support on mobile
   - Safari: Full support on iOS
   - Firefox: Limited support

### Google Contacts Integration Issues

**Issue**: "Google API credentials not configured" error

**Solution**: Update `src/config/google.js` with your actual credentials

**Issue**: "Sign in failed" error

**Solutions**:
1. Check your internet connection
2. Ensure the People API is enabled
3. Verify your OAuth credentials are correct
4. Check that your domain is in authorized origins

**Issue**: "Failed to create contact" error

**Solutions**:
1. Ensure you're signed in to Google
2. Check if the People API is enabled
3. Verify your API key has the correct permissions

## File Structure

```
src/
├── components/          # React components
│   ├── AddContact.jsx
│   ├── ContactsList.jsx
│   ├── CallHistory.jsx
│   ├── SaveTargetDialog.jsx
│   └── ...
├── utils/              # Utility functions
│   ├── storage.js      # localStorage operations
│   ├── googleContacts.js # Google API integration
│   └── ...
├── config/             # Configuration files
│   └── google.js       # Google API credentials
└── App.jsx             # Main application component
```

## Technologies Used

- **Frontend**: React 18, JSX
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Storage**: localStorage (local), Google People API (cloud)
- **Icons**: Custom SVG icons
- **Responsive Design**: Mobile-first approach

## Browser Support

- **Mobile**: iOS Safari 12+, Chrome Mobile 80+, Samsung Internet 10+
- **Desktop**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Features

1. Create new components in `src/components/`
2. Add utility functions in `src/utils/`
3. Update the main App.jsx as needed
4. Test on both mobile and desktop

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the Google Cloud Console setup
3. Check browser console for error messages
4. Ensure all dependencies are properly installed
