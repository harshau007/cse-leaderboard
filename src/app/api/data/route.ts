import { emails } from "@/lib/emails";
import { sendRankingChangeEmail } from "@/lib/sendEmail";
import { fetchAndUpdateUsers } from "@/lib/updateUsers";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const rankChanges = await fetchAndUpdateUsers();

    for (const change of rankChanges) {
      const { username, newRank, oldRank } = change;
      const userEmail = emails.find((e) => e.username === username)?.email;

      if (userEmail) {
        // Someone took this user's spot
        if (oldRank < newRank) {
          const displacedBy = rankChanges.find(
            (c) => c.newRank === oldRank
          )?.username;
          await sendRankingChangeEmail(
            userEmail,
            username,
            oldRank,
            newRank,
            displacedBy
          );
        }

        // This user took someone else's spot
        if (oldRank > newRank) {
          const displacedUser = rankChanges.find((c) => c.oldRank === newRank);
          if (displacedUser) {
            const displacedEmail = emails.find(
              (e) => e.username === displacedUser.username
            )?.email;
            if (displacedEmail) {
              await sendRankingChangeEmail(
                displacedEmail,
                displacedUser.username,
                displacedUser.oldRank,
                displacedUser.newRank,
                username
              );
            }
          }

          // Also send an email to the user who improved their rank
          await sendRankingChangeEmail(userEmail, username, oldRank, newRank);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Users updated successfully and emails sent",
    });
  } catch (error) {
    console.error("Error updating users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update users",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
