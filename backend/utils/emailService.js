const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // Check if credentials are set and not placeholder
  const isPlaceholder = !user || !pass || 
    user.includes('your-email') || 
    pass.includes('your-app-password') ||
    user === '' || pass === '';

  if (isPlaceholder) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Sends a 6-digit OTP verification email to the user's Gmail/email address.
 * 
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP string
 * @param {'login' | 'register'} purpose - Purpose of OTP
 * @param {string} [name] - Citizen's name
 * @returns {Promise<{success: boolean, error?: string, simulated?: boolean}>}
 */
const sendOtpEmail = async (email, otp, purpose = 'login', name = '') => {
  // Always log prominently to terminal for development/testing convenience
  console.log('\n============================================================');
  console.log(`[PENSIONER OTP] Sent to: ${email}`);
  console.log(`[PENSIONER OTP CODE] ===================> ${otp} <===================`);
  console.log(`[PURPOSE] ${purpose.toUpperCase()} | RECIPIENT: ${name || 'Pension Holder'} | TIME: ${new Date().toLocaleTimeString()}`);
  console.log('============================================================\n');

  const isRegister = purpose === 'register';
  const subjectBn = isRegister 
    ? 'পেনশন পোর্টাল: আপনার নিবন্ধন ওটিপি ভেরিফিকেশন কোড' 
    : 'পেনশন পোর্টাল: আপনার লগইন ওটিপি ভেরিফিকেশন কোড';
  const subjectEn = isRegister 
    ? 'PensionProBD: Registration Verification OTP Code' 
    : 'PensionProBD: Login Verification OTP Code';

  const fullSubject = `${subjectBn} | ${subjectEn}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>${fullSubject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F3; margin: 0; padding: 24px; color: #1a1a1a; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .header { background-color: #0B5D3B; padding: 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { margin: 0; font-size: 12px; opacity: 0.9; }
    .body { padding: 32px 28px; line-height: 1.6; }
    .greeting { font-size: 15px; margin-bottom: 16px; color: #1c1917; }
    .otp-box { background-color: #FAF8F3; border: 2px dashed #0B5D3B; border-radius: 6px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #0B5D3B; margin: 0; }
    .expiry { font-size: 12px; color: #78716c; margin-top: 8px; font-weight: 500; }
    .notice { background: #fefce8; border-left: 4px solid #ca8a04; padding: 12px 16px; font-size: 12px; color: #713f12; margin: 20px 0; line-height: 1.5; }
    .footer { border-top: 1px solid #f5f5f4; padding: 20px 28px; background: #fafaf9; font-size: 11px; color: #78716c; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>জাতীয় পেনশন ও অবসর সুবিধা পোর্টাল</h1>
      <p>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | হিসাব মহানিয়ন্ত্রকের কার্যালয় (CGA)</p>
    </div>
    <div class="body">
      <div class="greeting">
        <strong>শ্রদ্ধেয় ${name || 'পেনশনভোগী নাগরিক'},</strong><br>
        ${isRegister 
          ? 'জাতীয় পেনশন পোর্টাল (PensionProBD)-এ আপনার নাগরিক পেনশন অ্যাকাউন্ট নিবন্ধনের জন্য অনুরোধ গ্রহণ করা হয়েছে।' 
          : 'জাতীয় পেনশন পোর্টাল (PensionProBD)-এ আপনার পেনশন অ্যাকাউন্টে নিরাপদ প্রবেশ নিশ্চিত করতে নিচের ওটিপি ভেরিফিকেশন কোডটি ব্যবহার করুন।'
        }
      </div>

      <div class="otp-box">
        <div style="font-size: 11px; text-transform: uppercase; color: #57534e; letter-spacing: 1px; margin-bottom: 6px;">
          আপনার ৬-ডিজিটের ওটিপি ভেরিফিকেশন কোড
        </div>
        <div class="otp-code">${otp}</div>
        <div class="expiry">এই কোডটি আগামী ১০ মিনিটের জন্য কার্যকর থাকবে (Valid for 10 minutes)</div>
      </div>

      <div class="notice">
        <strong>⚠️ নিরাপত্তা সতর্কতা:</strong> আপনার ওটিপি কোডটি অত্যন্ত সংবেদনশীল। অনুগ্রহ করে এই কোডটি কারো সাথে শেয়ার করবেন না। সিজিএ বা পেনশন বিভাগের কোনো কর্মকর্তা কখনো আপনার ওটিপি জানতে চাইবেন না।
      </div>

      <p style="font-size: 13px; color: #44403c; margin-top: 20px;">
        আপনি যদি এই অনুরোধ না করে থাকেন, তবে অবিলম্বে আমাদের হেল্পলাইনে যোগাযোগ করুন।
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>হিসাব ভবন, সেগুনবাগিচা, ঢাকা-১০০০ | হেল্পলাইন: ১৬১২২ / ৩৩৩</strong></p>
      <p style="margin: 0;">National Pension & Retirement Benefits Management Portal (PensionProBD) © ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('[EMAIL INFO] SMTP credentials not fully configured in backend/.env. Using console OTP.');
      return { success: true, simulated: true };
    }

    const mailOptions = {
      from: `"PensionProBD - CGA" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: fullSubject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL SUCCESS] Message sent via SMTP:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send email via SMTP:', error.message);
    // Don't throw or fail the entire request - OTP is safely stored in DB and logged in console
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOtpEmail
};

