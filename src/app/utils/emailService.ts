import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordEmail(email: string, password: string) {
  try {
    await resend.emails.send({
      from: "Your School <no-reply@yourschool.com>", // Must be a verified sender in Resend
      to: email,
      subject: "Your Teacher Login Credentials",
      html: `
        <p>Hi there,</p>
        <p>Welcome to our platform! Here are your login credentials:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p><strong>Login URL:</strong> <a href="https://yourapp.com/login">Login Here</a></p>
        <p>Please keep this information safe. Your password cannot be changed.</p>
        <p>Best Regards,<br/>Your School Team</p>
      `,
    });

    console.log(`✅ Password email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Email sending failed");
  }
}
