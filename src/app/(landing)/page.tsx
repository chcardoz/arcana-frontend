"use client";
import { motion, stagger } from "framer-motion";

export default function LandingPage() {
  const variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const variants2 = {
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <>
      <div className="mx-auto flex min-h-[calc(100dvh)] flex-row items-center justify-around">
        <motion.div
          variants={variants}
          animate="animate"
          initial="initial"
          className="flex flex-col items-center justify-center md:w-2/3"
        >
          <motion.h1
            variants={variants2}
            animate="animate"
            initial="initial"
            className="text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-8xl"
          >
            Learning infrastructure for the internet
          </motion.h1>
          <motion.p
            variants={variants2}
            animate="animate"
            initial="initial"
            className="mt-4 text-center text-lg md:w-1/2"
          >
            Discover a world of knowledge and skills at your fingertips. Join
            our vibrant community of learners and start your journey today.
          </motion.p>
        </motion.div>
      </div>
      <div>Second section</div>
    </>
  );
}
