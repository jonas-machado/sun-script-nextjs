"use client"

import { motion, AnimatePresence } from "framer-motion"

export default function PageWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.3,
                        ease: [0, 0.71, 0.2, 1.01],
                    }}
                >
                    {children}
                </motion.div >
            </AnimatePresence >
        </>
    )
}