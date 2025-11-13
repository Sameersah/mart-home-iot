# How to Get Gmail App Password

## Why App Password is Required

Gmail no longer allows regular passwords for third-party applications. You **must** use an App Password, which only appears after enabling 2-Step Verification.

## Step-by-Step Instructions

### Step 1: Enable 2-Step Verification

1. Go to **https://myaccount.google.com/security**
2. Sign in with your Google account (`sameersah7365@gmail.com`)
3. Scroll down to **"How you sign in to Google"** section
4. Look for **"2-Step Verification"** (may also be called "Two-step verification")
5. Click on it
6. Click **"Get started"** or **"Turn on"**
7. Follow the prompts:
   - Enter your phone number
   - Choose verification method (text message or phone call)
   - Enter the verification code you receive
   - Click **"Turn on"**

### Step 2: Generate App Password

**After 2-Step Verification is enabled:**

1. Go back to **https://myaccount.google.com/security**
2. Under **"How you sign in to Google"**, you should now see **"App passwords"**
3. Click **"App passwords"**
4. You may need to sign in again
5. Select:
   - **App**: Mail
   - **Device**: Other (Custom name)
   - **Name**: Enter "Firebase Functions"
6. Click **"Generate"**
7. You'll see a 16-character password like: `abcd efgh ijkl mnop`
8. **Copy this password** (you can't see it again!)
9. Remove the spaces: `abcdefghijklmnop`

### Step 3: Use in Code

Update `functions/index.js`:

```javascript
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'sameersah7365@gmail.com',
    pass: 'abcdefghijklmnop'  // Use the App Password here (no spaces)
  }
};
```

## Troubleshooting

### "I don't see App passwords option"

**Possible reasons:**
1. **2-Step Verification not enabled** - This is the most common reason. You MUST enable it first.
2. **Using Google Workspace account** - Some organization accounts disable App Passwords. Contact your admin.
3. **Account type** - Some account types don't support App Passwords.

**Solution:**
- Make sure 2-Step Verification is fully enabled and verified
- Wait a few minutes after enabling, then refresh the page
- Try a different browser or incognito mode

### "2-Step Verification option not visible"

**Possible reasons:**
1. Account security restrictions
2. Account not fully verified
3. Using a managed Google account

**Solution:**
- Complete account verification
- Check if you have a personal Gmail account (not Workspace)
- Try from a different device

### Alternative: Use Different Email Service

If you can't get App Passwords to work, you can use:

1. **Outlook/Hotmail** - Similar setup, may be easier
2. **SendGrid** - Free tier available, API-based
3. **Mailgun** - Free tier available
4. **SMTP with different provider**

## Security Note

⚠️ **NEVER use your regular Gmail password in code!**
- It won't work anyway (Gmail blocks it)
- It's a security risk
- Always use App Passwords for third-party apps

## Quick Checklist

- [ ] 2-Step Verification enabled
- [ ] App passwords option visible
- [ ] App password generated
- [ ] Password copied (16 characters, no spaces)
- [ ] Password added to `functions/index.js`
- [ ] Code deployed to Firebase

## Still Having Issues?

If you still can't see App Passwords after enabling 2-Step Verification:

1. **Wait 5-10 minutes** - Sometimes there's a delay
2. **Clear browser cache** and try again
3. **Try different browser** (Chrome, Firefox, Safari)
4. **Check account type** - Make sure it's a personal Gmail account
5. **Contact Google Support** - If it's a personal account and still not working

## Alternative: Use Firebase Environment Config (More Secure)

Instead of hardcoding the password, use Firebase config:

```bash
firebase functions:config:set email.user="sameersah7365@gmail.com"
firebase functions:config:set email.pass="your-app-password"
```

Then in code:
```javascript
const emailUser = functions.config().email.user;
const emailPass = functions.config().email.pass;
```

This keeps credentials out of your code files.

