"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Spinner from "@/components/ui/spinner";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/pages/login");
    }, 8000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* Logo + Text + Spinner */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="relative z-10">MarkMe</span>
          <motion.div
            className="absolute inset-0 rounded-full blur-lg opacity-30 bg-gray-600"
            initial={{ scale: 0.7, opacity: 0.2 }}
            animate={{ scale: 1.1, opacity: 0.4 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.h1>

        <motion.p
          className="mt-4 text-md md:text-2xl"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your Smart Attendance System
        </motion.p>

        {/* Spinner */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Spinner />
        </motion.div>
      </motion.div>
    </div>
  );
}
