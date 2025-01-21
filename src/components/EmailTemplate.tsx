import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface RankingChangeEmailProps {
  username: string;
  oldRank: number;
  newRank: number;
  displacedBy?: string;
}

export const RankingChangeEmail = ({
  username,
  oldRank,
  newRank,
  displacedBy,
}: RankingChangeEmailProps) => {
  const previewText = displacedBy
    ? `Your LeetCode ranking has changed from ${oldRank} to ${newRank}.`
    : `You've taken the #${newRank} spot on the LeetCode leaderboard!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>LeetCode Ranking Update</Heading>
          <Text style={text}>Hello {username},</Text>
          {displacedBy ? (
            <>
              <Text style={text}>
                Your LeetCode ranking has changed from #{oldRank} to #{newRank}.
              </Text>
              <Text style={text}>
                {displacedBy} has taken your previous spot. Keep coding and
                climb back up!
              </Text>
            </>
          ) : (
            <Text style={text}>
              Congratulations! You've improved your ranking from #{oldRank} to #
              {newRank}. Keep up the great work!
            </Text>
          )}
          <Text style={text}>
            View the full leaderboard and your progress on our{" "}
            <Link href="https://leetcode-leaderboard.vercel.app">
              LeetCode Leaderboard
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default RankingChangeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "17px 0 0",
  margin: "0",
};

const text = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
};
