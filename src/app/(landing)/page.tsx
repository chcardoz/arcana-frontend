"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Brush,
  User,
  Music,
  Divide,
  Code,
  Book,
  Gamepad,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const occupations = [
  {
    name: "gamers",
    icon: <Gamepad className="h-16 w-16" />,
  },
  {
    name: "artists",
    icon: <Brush className="h-16 w-16" />,
  },
  {
    name: "students",
    icon: <User className="h-16 w-16" />,
  },
  {
    name: "developers",
    icon: <Code className="h-16 w-16" />,
  },
  {
    name: "learners",
    icon: <Book className="h-16 w-16" />,
  },
];

export default function LandingPage() {
  const [currentOccupation, setCurrentOccupation] = useState(occupations[0]);

  const shuffle = useCallback(() => {
    const index = Math.floor(Math.random() * occupations.length);
    setCurrentOccupation(occupations[index]);
  }, []);

  useEffect(() => {
    const intervalID = setInterval(shuffle, 1500);
    return () => clearInterval(intervalID);
  }, [shuffle]);

  const variants = {
    hidden: {
      opacity: 0,
      x: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <div className="mt-28 flex min-h-[calc(95dvh)] flex-col items-center gap-2">
        <motion.div
          initial={false}
          variants={variants}
          className="mx-4 dark:text-gray-100"
        >
          {currentOccupation?.icon}
        </motion.div>
        <motion.div className="flex w-full flex-col items-center p-6">
          <motion.h1 className="text-center font-title text-5xl font-bold sm:text-6xl md:min-w-[75%] lg:text-7xl dark:text-gray-300">
            Peer-to-Peer
          </motion.h1>
          <motion.h1 className="text-center font-title text-5xl font-bold sm:text-6xl md:min-w-[75%] lg:text-7xl dark:text-gray-300">
            coaching for
          </motion.h1>
          <motion.h1
            key={currentOccupation?.name}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ ease: "easeInOut" }}
            className="overflow-ellipsis text-center font-title text-5xl font-bold sm:text-6xl lg:text-7xl dark:text-gray-300"
          >
            {currentOccupation?.name}
          </motion.h1>
          <motion.p
            variants={variants}
            className="mt-4 text-center text-lg sm:max-w-[60%] lg:max-w-[50%] dark:text-gray-400"
          >
            Getting even <span className="font-bold">15 minutes</span> with
            someone in your field can save you days of uncertainty and
            frustration when trying to learn something new.
          </motion.p>
          <motion.p
            variants={variants}
            className="mt-4 text-center text-lg sm:max-w-[50%] lg:max-w-[40%] dark:text-gray-400"
          >
            On demand matching based on your interests
          </motion.p>
        </motion.div>
        <Link href="https://tally.so/r/w4LQld">
          <Button variant="outline">Get Matched</Button>
        </Link>
      </div>
    </>
  );
}
