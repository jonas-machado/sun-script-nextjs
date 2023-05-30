import "./globals.css";
import { Nunito } from "next/font/google";
const font = Nunito({ subsets: ["latin"] });
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./lib/pageWrapper";
import MotionPage from "./lib/motionPage";
import AuthContext from "./lib/AuthContext";

export const metadata = {
  title: "Sun Script",
  description: "Utilitários para o N2",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AuthContext>
          <PageWrapper>
            <MotionPage>{children}</MotionPage>
          </PageWrapper>
        </AuthContext>
      </body>
    </html>
  );
}
