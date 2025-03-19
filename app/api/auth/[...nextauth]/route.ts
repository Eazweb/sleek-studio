import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Parse the allowed redirect URLs
const redirectUrls = process.env.NEXTAUTH_REDIRECT_URLS
  ? process.env.NEXTAUTH_REDIRECT_URLS.split(",")
  : [];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Check if the redirect URL is one of our allowed domains
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (redirectUrls.some(allowedUrl => url.startsWith(allowedUrl))) {
        return url;
      }
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };