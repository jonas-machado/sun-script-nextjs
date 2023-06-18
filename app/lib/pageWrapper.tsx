"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </>
  );
}
