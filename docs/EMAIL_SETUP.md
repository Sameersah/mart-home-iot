# Email Notification Setup Guide

This guide explains how to set up email notifications when the photoresistor value drops below 1800.

## Overview

The system uses Firebase Cloud Functions to monitor the light sensor value in real-time. When the value drops below 1800, an email is automatically sent to `sameersah7365@gmail.com`.

## Prerequisites

1. Firebase project (already set up)
2. Gmail account with 2-Step Verification enabled
3. Node.js and npm installed
4. Firebase CLI installed

## Step-by-Step Setup

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

### Step 3: Initialize Functions (if not already done)

```bash
cd /Users/sameer/Documents/1-SJSU/CMPE-286-IOT/term-end-project
firebase init functions
```

Select:
- Use existing project: `iot-smart-home-fb391`
- Language: JavaScript
- ESLint: Yes
- Install dependencies: Yes

### Step 4: Install Dependencies

```bash
cd functions
npm install
```

### Step 5: Configure Email Settings

1. Open `functions/index.js`
2. Find the `EMAIL_CONFIG` section
3. Update with your Gmail credentials:

```javascript
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // Your Gmail address
    pass: 'your-app-password'       // Gmail App Password (see Step 6)
  }
};
```

### Step 6: Get Gmail App Password

1. Go to https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under "Signing in to Google", enable **2-Step Verification** (if not already enabled)
4. After enabling, go back to Security
5. Click **App passwords** (appears after 2-Step Verification is enabled)
6. Select **Mail** and **Other (Custom name)**
7. Enter "Firebase Functions" as the name
8. Click **Generate**
9. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
10. Use this password in `EMAIL_CONFIG.auth.pass` (remove spaces)

**Important**: Use the App Password, NOT your regular Gmail password.

### Step 7: Deploy the Function

```bash
# From project root
firebase deploy --only functions
```

Or:

```bash
cd functions
npm run deploy
```

### Step 8: Verify Deployment

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `iot-smart-home-fb391`
3. Go to **Functions** in the left sidebar
4. You should see `sendLightAlert` function listed

## Testing

### Test 1: Manual Database Update

1. Go to Firebase Console → Realtime Database
2. Navigate to `/sensors/light`
3. Change value from above 1800 to below 1800 (e.g., 1500)
4. Check email inbox at `sameersah7365@gmail.com`
5. You should receive an email within a few seconds

### Test 2: Using Test Function

1. Deploy includes a test function
2. Get the function URL from Firebase Console
3. Visit the URL in browser or use curl:
   ```bash
   curl https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/testEmail
   ```

### Test 3: Real Sensor Data

1. Ensure ESP32 is running and publishing to Firebase
2. Cover the photoresistor to drop light level below 1800
3. Email should be sent automatically

## How It Works

1. ESP32 publishes light sensor value to `/sensors/light` in Firebase
2. Cloud Function `sendLightAlert` monitors this path
3. When value changes from ≥1800 to <1800, function triggers
4. Function sends email using Nodemailer via Gmail SMTP
5. Email delivered to `sameersah7365@gmail.com`

## Monitoring

### View Function Logs

```bash
firebase functions:log --only sendLightAlert
```

### View in Firebase Console

1. Go to Firebase Console → Functions
2. Click on `sendLightAlert`
3. View **Logs** tab

## Troubleshooting

### Email Not Sending

1. **Check Gmail App Password**: Make sure you're using App Password, not regular password
2. **Check 2-Step Verification**: Must be enabled to generate App Password
3. **Check Function Logs**: Look for error messages
4. **Verify Email Config**: Ensure `EMAIL_CONFIG` in `index.js` is correct

### Function Not Triggering

1. **Check Database Path**: Verify ESP32 is writing to `/sensors/light`
2. **Check Function Status**: Ensure function is deployed and active
3. **Check Database Rules**: Ensure read/write permissions are set

### Common Errors

- **"Invalid login"**: Wrong App Password or email
- **"Function timeout"**: Increase timeout in function config
- **"Permission denied"**: Check Firebase project permissions

## Customization

### Change Threshold

Edit `functions/index.js`:
```javascript
if (newValue < 1800 && previousValue >= 1800) {
  // Change 1800 to your desired threshold
}
```

### Change Recipient Email

Edit `functions/index.js`:
```javascript
to: 'sameersah7365@gmail.com',  // Change to your email
```

### Change Email Template

Edit the `html` and `text` fields in `mailOptions` in `functions/index.js`.

## Security Notes

- Never commit `functions/index.js` with real credentials to public repositories
- Use Firebase Environment Config for sensitive data:
  ```bash
  firebase functions:config:set email.user="your-email@gmail.com"
  firebase functions:config:set email.pass="your-app-password"
  ```
- Then access in code:
  ```javascript
  const emailUser = functions.config().email.user;
  const emailPass = functions.config().email.pass;
  ```

## Next Steps

After setup:
1. Test with real sensor data
2. Monitor function logs for any issues
3. Adjust email template if needed
4. Consider adding more alert conditions

