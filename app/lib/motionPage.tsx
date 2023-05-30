"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function MotionPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <motion.div
        key="login"
        id="container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.2,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
