/**
 * Firebase Cloud Functions for Light Intensity Monitoring System
 * Food and Beverage Optical Inspection Application
 *
 * Function: sendLightAlert
 * Purpose: Monitor light intensity and send email alerts when illumination
 *          drops below operational threshold (1800)
 * 
 * Triggers: When light sensor value drops below 1800 (from ≥ 1800 to < 1800)
 * Action: Sends email notification to operators/maintenance personnel
 * Recipient: sameersah7365@gmail.com (configurable)
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
          subject: "⚠️ ALERT: Light Intensity Below Threshold - Optical Inspection System",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h2 style="color: #E74C3C;">⚠️ Light Intensity Alert</h2>
              <p style="font-size: 16px; color: #2C3E50;">
                <strong>Action Required:</strong> Light intensity has dropped below operational threshold.
                Inspection system accuracy may be compromised.
              </p>
              <div style="background-color: #F8F9FA; padding: 20px; border-left: 4px solid #E74C3C; margin: 20px 0;">
                <h3 style="color: #2C3E50; margin-top: 0;">Inspection System Details:</h3>
                <p><strong>Current Light Level:</strong>
                  <span style="color: #E74C3C; font-size: 1.2em; font-weight: bold;">${newValue}</span>
                  <span style="color: #7F8C8D; font-size: 0.9em;"> (ADC value, range: 0-4095)</span>
                </p>
                <p><strong>Previous Light Level:</strong> ${previousValue}</p>
                <p><strong>Operational Threshold:</strong> 1800</p>
                <p><strong>Status:</strong> <span style="color: #E74C3C; font-weight: bold;">BELOW THRESHOLD</span></p>
                <p><strong>Alert Time:</strong> ${timestamp}</p>
              </div>
              <div style="background-color: #FFF3CD; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;">
                  <strong>⚠️ Recommended Actions:</strong><br>
                  1. Check inspection system lighting fixtures<br>
                  2. Verify power supply to lighting system<br>
                  3. Inspect for dust accumulation on lenses<br>
                  4. Review LED aging or thermal drift<br>
                  5. Consider maintenance schedule adjustment
                </p>
              </div>
              <p style="color: #7F8C8D; font-size: 0.9em; margin-top: 20px;">
                This is an automated alert from the Light Intensity Monitoring System
                for Food and Beverage Optical Inspection.
              </p>
            </div>
          `,
          text: `
⚠️ LIGHT INTENSITY ALERT - OPTICAL INSPECTION SYSTEM

Action Required: Light intensity has dropped below operational threshold.
Inspection system accuracy may be compromised.

Inspection System Details:
- Current Light Level: ${newValue} (ADC value, range: 0-4095)
- Previous Light Level: ${previousValue}
- Operational Threshold: 1800
- Status: BELOW THRESHOLD
- Alert Time: ${timestamp}

Recommended Actions:
1. Check inspection system lighting fixtures
2. Verify power supply to lighting system
3. Inspect for dust accumulation on lenses
4. Review LED aging or thermal drift
5. Consider maintenance schedule adjustment

This is an automated alert from the Light Intensity Monitoring System
for Food and Beverage Optical Inspection.
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
