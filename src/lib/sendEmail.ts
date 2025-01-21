import RankingChangeEmail from "@/components/EmailTemplate";
import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport with Mailtrap credentials
const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export async function sendRankingChangeEmail(
  to: string,
  username: string,
  oldRank: number,
  newRank: number,
  displacedBy?: string
) {
  try {
    const mailOptions = {
      from: "LeetCode Leaderboard <onboarding@yourdomain.com>", // Change this to your email
      to: [to],
      subject: displacedBy
        ? `Your LeetCode ranking has changed`
        : `You've improved your LeetCode ranking!`,
      html: JSON.stringify(
        RankingChangeEmail({ username, oldRank, newRank, displacedBy })
      ),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
