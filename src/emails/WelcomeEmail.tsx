import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Heading,
  Hr,
} from "@react-email/components";

interface WelcomeEmailProps {
  email: string;
}

export function WelcomeEmail({ email }: WelcomeEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            {/* Header */}
            <Heading style={h1}>Welcome to BinaryStories! 🎉</Heading>

            <Text style={text}>
              Thank you for subscribing to our newsletter. We&apos;re excited to
              have you as part of our community!
            </Text>

            <Text style={text}>
              You&apos;ll now receive our latest articles, insights, and updates
              delivered straight to your inbox. We publish thoughtful content on
              technology, development, and more.
            </Text>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Link href={`${baseUrl}/blog`} style={button}>
                Explore Our Articles
              </Link>
            </Section>

            <Text style={text}>
              Looking forward to sharing great content with you!
            </Text>

            <Text style={text}>
              Best regards,
              <br />
              The BinaryStories Team
            </Text>

            <Hr style={hr} />

            {/* Footer */}
            <Text style={footer}>
              You&apos;re receiving this email because you subscribed to
              BinaryStories newsletter using {email}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f3f4f6",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const content = {
  padding: "0 48px",
};

const h1 = {
  color: "#111827",
  fontSize: "32px",
  fontWeight: "700",
  margin: "40px 0 20px",
  padding: "0",
  lineHeight: "1.3",
};

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#111827",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "16px 0",
};
