# Firebase Cloud Functions - Email Notifications

This directory contains Firebase Cloud Functions for sending email notifications when the light sensor value drops below 1800.

## Setup Instructions

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Install Dependencies

```bash
cd functions
npm install
```

### 4. Configure Email Settings

Edit `functions/index.js` and update the email configuration:

```javascript
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // Your Gmail address
    pass: 'your-app-password'       // Gmail App Password
  }
};
```

### 5. Get Gmail App Password

1. Go to https://myaccount.google.com/
2. Security → 2-Step Verification (must be enabled)
3. App passwords → Generate new app password
4. Copy the 16-character password
5. Use this password in `EMAIL_CONFIG.auth.pass`

### 6. Deploy Functions

```bash
# From project root
firebase deploy --only functions
```

Or from functions directory:
```bash
cd functions
npm run deploy
```

## Functions

### `sendLightAlert`
- **Trigger**: Database update on `/sensors/light`
- **Action**: Sends email when light value drops below 1800
- **Recipient**: sameersah7365@gmail.com

### `testEmail` (Optional)
- **Trigger**: HTTP request
- **Action**: Sends a test email
- **URL**: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/testEmail`

## Testing

1. Deploy the function
2. Update the light value in Firebase Realtime Database to below 1800
3. Check your email inbox (sameersah7365@gmail.com)
4. Check Firebase Functions logs: `firebase functions:log`

## Troubleshooting

- **Email not sending**: Check Gmail App Password is correct
- **Function not triggering**: Verify database path is `/sensors/light`
- **Check logs**: `firebase functions:log --only sendLightAlert`

