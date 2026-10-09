import nodemailer from "nodemailer";

// Gmail transporter — .env mein GMAIL_USER aur GMAIL_APP_PASSWORD set karo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not your real password)
  },
});

export async function sendOTPEmail(to: string, otp: string, name?: string) {
  const mailOptions = {
    from: `"Veblix AI" <${process.env.GMAIL_USER}>`,
    to,
    subject: "🔐 Your Password Reset OTP - Veblix AI",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#090a0f;font-family:'Segoe UI',sans-serif;">
        <div style="max-width:480px;margin:40px auto;background:#111827;border:1px solid #374151;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:32px 32px 24px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">✨</div>
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Veblix AI</h1>
            <p style="color:#c4b5fd;margin:4px 0 0;font-size:13px;">Password Reset Request</p>
          </div>

          <!-- Body -->
          <div style="padding:32px;">
            <p style="color:#d1d5db;font-size:15px;margin:0 0 8px;">
              Namaste${name ? ` <strong style="color:#fff">${name}</strong>` : ""}! 👋
            </p>
            <p style="color:#9ca3af;font-size:14px;margin:0 0 24px;">
              Aapne password reset ke liye request kiya hai. Neeche diya gaya OTP use karo:
            </p>

            <!-- OTP Box -->
            <div style="background:#1f2937;border:2px dashed #7c3aed;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
              <p style="color:#9ca3af;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Your OTP</p>
              <div style="font-size:42px;font-weight:800;letter-spacing:10px;color:#a78bfa;font-family:monospace;">
                ${otp}
              </div>
              <p style="color:#6b7280;font-size:12px;margin:12px 0 0;">⏰ Yeh OTP sirf <strong style="color:#fbbf24">10 minutes</strong> ke liye valid hai</p>
            </div>

            <p style="color:#6b7280;font-size:12px;margin:0;">
              Agar aapne yeh request nahi kiya, toh is email ko ignore karo. Aapka account safe hai.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#0f172a;padding:16px 32px;text-align:center;border-top:1px solid #1f2937;">
            <p style="color:#4b5563;font-size:11px;margin:0;">
              Veblix AI • Made with ❤️ by Abhishek
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}
