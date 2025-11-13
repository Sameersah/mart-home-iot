/**
 * Firebase Cloud Functions for IoT Smart Home
 *
 * Function: sendLightAlert
 * Triggers when light sensor value drops below 1800
 * Sends email notification to sameersah7365@gmail.com
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase Admin
admin.initializeApp();

// Email configuration
// IMPORTANT: For Gmail, you MUST use an App Password
// (not your regular password)
// TO GET APP PASSWORD:
// 1. Go to https://myaccount.google.com/security
// 2. Enable "2-Step Verification" (if not already enabled)
// 3. After enabling, go back to Security
// 4. Click "App passwords" (will appear after 2-Step)
// 5. Generate password for "Mail" → "Other"
// 6. Copy the 16-character password (remove spaces)
const EMAIL_CONFIG = {
  service: "gmail",
  auth: {
    user: "sameersah7365@gmail.com",
    pass: "fqkraotsfzncuxhf", // Gmail App Password
  },
};

// Create email transporter
const transporter = nodemailer.createTransport({
  service: EMAIL_CONFIG.service,
  auth: EMAIL_CONFIG.auth,
});

/**
 * Cloud Function: sendLightAlert
 * Monitors /sensors/light in Firebase Realtime Database
 * Sends email when light value drops below 1800
 */
exports.sendLightAlert = functions.database
    .ref("/sensors/light")
    .onUpdate(async (change, context) => {
      const newValue = change.after.val();
      const previousValue = change.before.val();

      console.log(`Light value changed: ${previousValue} -> ${newValue}`);

      // Check if value dropped below threshold (1800)
      // Only trigger when crossing threshold
      if (newValue < 1800 && previousValue >= 1800) {
        console.log(`Alert triggered! Light dropped below 1800: ${newValue}`);

        const timestamp = new Date().toLocaleString();
        const mailOptions = {
          from: EMAIL_CONFIG.auth.user,
          to: "sameersah7365@gmail.com",
          subject: "Light Level Alert - Low Light Detected",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h2 style="color: #FF6B6B;">Light Level Alert</h2>
              <p>The light level has dropped below the threshold!</p>
              <div style="background-color: #F8F9FA; padding: 20px;">
                <h3>Sensor Details:</h3>
                <p><strong>Current Light Level:</strong>
                  <span style="color: #FF6B6B;">${newValue}</span>
                </p>
                <p><strong>Previous Light Level:</strong> ${previousValue}</p>
                <p><strong>Threshold:</strong> 1800</p>
                <p><strong>Alert Time:</strong> ${timestamp}</p>
              </div>
              <p style="color: #666;">
                Automated alert from IoT Smart Home system.
              </p>
            </div>
          `,
          text: `
Light Level Alert

The light level has dropped below the threshold!

Current Light Level: ${newValue}
Previous Light Level: ${previousValue}
Threshold: 1800
Alert Time: ${timestamp}

Automated alert from IoT Smart Home system.
          `,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent successfully:", info.messageId);
          return {success: true, messageId: info.messageId};
        } catch (error) {
          console.error("Error sending email:", error);
          throw new functions.https.HttpsError(
              "internal",
              "Failed to send email",
              error,
          );
        }
      }

      // No alert needed
      return null;
    });

/**
 * Optional: HTTP-triggered function for testing
 * URL: https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/testEmail
 */
exports.testEmail = functions.https.onRequest(async (req, res) => {
  console.log("📧 Test email function called");

  // Test transporter connection first
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified");
  } catch (verifyError) {
    console.error("❌ SMTP verification failed:", verifyError);
    return res.status(500).json({
      success: false,
      error: "SMTP verification failed",
      details: verifyError.message,
    });
  }

  const timestamp = new Date().toLocaleString();
  const mailOptions = {
    from: EMAIL_CONFIG.auth.user,
    to: "sameersah7365@gmail.com",
    subject: "✅ Test Email - IoT Smart Home System",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;
        padding: 20px; border: 2px solid #4CAF50; border-radius: 8px;">
        <h2 style="color: #4CAF50;">✅ Test Email Successful!</h2>
        <p>This is a test email from your IoT Smart Home Cloud Function.</p>
        <div style="background-color: #F8F9FA; padding: 15px;
          border-radius: 5px; margin: 15px 0;">
          <p><strong>Timestamp:</strong> ${timestamp}</p>
          <p><strong>From:</strong> ${EMAIL_CONFIG.auth.user}</p>
          <p><strong>To:</strong> sameersah7365@gmail.com</p>
        </div>
        <p style="color: #666; font-size: 0.9em;">
          If you received this email, your email notification system
          is working correctly! 🎉
        </p>
        <p style="color: #666; font-size: 0.9em;">
          Your IoT Smart Home system will send alerts when the light
          sensor value drops below 1800.
        </p>
      </div>
    `,
    text: `
Test Email - IoT Smart Home System

This is a test email from your IoT Smart Home Cloud Function.

Timestamp: ${timestamp}
From: ${EMAIL_CONFIG.auth.user}
To: sameersah7365@gmail.com

If you received this email, your email notification system
is working correctly!

Your IoT Smart Home system will send alerts when the light
sensor value drops below 1800.
    `,
  };

  try {
    console.log("📤 Attempting to send email...");
    console.log("   From:", EMAIL_CONFIG.auth.user);
    console.log("   To: sameersah7365@gmail.com");

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("   Message ID:", info.messageId);
    console.log("   Response:", info.response);

    return res.json({
      success: true,
      messageId: info.messageId,
      response: info.response,
      message: "Email sent successfully! Check your inbox (and spam folder).",
      timestamp: timestamp,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    console.error("   Error code:", error.code);
    console.error("   Error command:", error.command);
    console.error("   Error response:", error.response);

    return res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      message: "Check function logs for more details",
    });
  }
});
