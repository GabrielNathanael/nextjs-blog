import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Heading,
  Img,
  Hr,
} from "@react-email/components";

interface PostNewsletterEmailProps {
  post: {
    title: string;
    slug: string;
    shortDesc: string;
    thumbnail: string;
    author: { name: string };
    category: { name: string };
  };
}

export function PostNewsletterEmail({ post }: PostNewsletterEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            {/* Logo/Brand */}
            <Heading style={brand}>BinaryStories</Heading>

            {/* Category Badge */}
            <Text style={category}>{post.category.name.toUpperCase()}</Text>

            {/* Thumbnail */}
            <Img
              src={post.thumbnail}
              alt={post.title}
              style={thumbnail}
              width="600"
            />

            {/* Title */}
            <Heading style={title}>{post.title}</Heading>

            {/* Description */}
            <Text style={description}>{post.shortDesc}</Text>

            {/* Author */}
            <Text style={author}>By {post.author.name}</Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link href={postUrl} style={button}>
                Read Full Article
              </Link>
            </Section>

            <Hr style={hr} />

            {/* Footer */}
            <Text style={footer}>
              You&apos;re receiving this because you subscribed to BinaryStories
              newsletter.
            </Text>

            <Text style={footer}>
              <Link href={baseUrl} style={footerLink}>
                Visit Website
              </Link>
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
  maxWidth: "600px",
};

const content = {
  padding: "0 48px",
};

const brand = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "700",
  margin: "40px 0 20px",
  padding: "0",
};

const category = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0.5px",
  margin: "0 0 20px",
  textTransform: "uppercase" as const,
};

const thumbnail = {
  width: "100%",
  height: "auto",
  borderRadius: "8px",
  margin: "0 0 30px",
};

const title = {
  color: "#111827",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 16px",
};

const description = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 20px",
};

const author = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 30px",
};

const buttonContainer = {
  margin: "32px 0",
};

const button = {
  backgroundColor: "#111827",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
  width: "100%",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "10px 0",
  textAlign: "center" as const,
};

const footerLink = {
  color: "#6b7280",
  textDecoration: "underline",
};
