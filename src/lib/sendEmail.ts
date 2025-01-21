import RankingChangeEmail from "@/components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRankingChangeEmail(
  to: string,
  username: string,
  oldRank: number,
  newRank: number,
  displacedBy?: string
) {
  try {
    const data = await resend.emails.send({
      from: "LeetCode Leaderboard <noreply@cse-leaderboard.vercel.app>",
      to: [to],
      subject: displacedBy
        ? `Your LeetCode ranking has changed`
        : `You've improved your LeetCode ranking!`,
      react: RankingChangeEmail({ username, oldRank, newRank, displacedBy }),
    });

    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
