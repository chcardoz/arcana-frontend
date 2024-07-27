"use client";
import { motion } from "framer-motion";
import { MoveDown } from "lucide-react";

export default function LandingPage() {
  const variants = {
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delay: 0.1,
      },
    },
  };

  const variants2 = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeInOut",
      },
    },
  };
  return (
    <>
      <div className="mx-auto flex min-h-[calc(100dvh)] flex-row items-center justify-around">
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center md:w-2/3"
        >
          <motion.h1
            variants={variants2}
            className="text-center font-title text-5xl font-bold sm:text-6xl md:min-w-[75%] lg:text-7xl dark:text-gray-300"
          >
            Learn faster
          </motion.h1>
          <motion.h1
            variants={variants2}
            className="text-center font-title text-5xl font-bold sm:text-6xl lg:text-7xl dark:text-gray-300"
          >
            on the internet
          </motion.h1>
          <motion.p
            variants={variants2}
            className="mt-4 text-center text-lg md:w-[60%] dark:text-gray-400"
          >
            Our browser exntesion helps you retain information faster by asking
            you questions about the content you are viewing. You can also save
            text snippets for later use.
          </motion.p>
          <motion.button
            variants={variants2}
            className="mt-4 rounded-md bg-red-300 p-2 text-lg text-black dark:bg-slate-600 dark:text-white"
          >
            Download Extension
          </motion.button>
          <motion.div
            variants={variants2}
            className="absolute bottom-0 flex flex-grow flex-col items-center justify-around gap-2 p-2"
          >
            <p className="text-center text-sm dark:text-gray-400">
              Check out how it works below
            </p>
            <MoveDown className="h-5 w-5 animate-bounce dark:text-gray-200" />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
