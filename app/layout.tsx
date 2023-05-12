import "./globals.css";
import { Nunito } from "next/font/google";
import getCurrentUser from "./actions/getCurrentUser";
const font = Nunito({ subsets: ["latin"] });
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./lib/pageWrapper";

export const metadata = {
  title: "Sun Script",
  description: "Utilitários para o N2",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = getCurrentUser();
  return (
    <html lang="en">
      <body className={font.className}>
        <PageWrapper>
          {children}
        </PageWrapper>
      </body>
    </html>
  );
}
