import "./globals.css";
import { Nunito } from "next/font/google";
const font = Nunito({ subsets: ["latin"] });
import { AnimatePresence } from "framer-motion";
import PageWrapper from "../lib/pageWrapper";
import MotionPage from "../lib/motionPage";
import AuthContext from "../lib/AuthContext";

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
      <body
        className={
          font.className +
          " bg-black bg-no-repeat bg-fit h-full min-h-screen scrollbar-corner-transparent resize-none scrollbar-thumb-rounded-md scrollbar scrollbar-thumb-gray-800 scrollbar-track-gray-900 scrollbar-track-rounded-md"
        }
      >
        <AuthContext>
          <PageWrapper>{children}</PageWrapper>
        </AuthContext>
      </body>
    </html>
  );
}
