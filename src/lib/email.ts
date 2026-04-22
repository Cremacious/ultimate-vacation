import { Resend } from "resend";

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[email] password reset → ${resetUrl}`);
    return;
  }
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "TripWave <noreply@tripwave.app>",
    to,
    subject: "Reset your TripWave password",
    html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">Reset password</a></p><p>If you didn't request this, you can ignore this email.</p>`,
  });
}
