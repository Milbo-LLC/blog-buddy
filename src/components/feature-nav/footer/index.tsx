"use client";

import Image from "next/image";
import milboLogo from "@/assets/logo.svg";
import { motion } from "framer-motion";
import Link from "next/link";

// Copyright copy
const message = `Made with 🤍 in Salem, MA`;
const company = `Milbo LLC`;
const crYear = `© ${new Date().getFullYear()}`;

const Copyright = () => {
  return (
    <div className="flex text-end">
      <div className="flex flex-row justify-center gap-1">
        <div>{company}</div>
        <div>{crYear}</div>
      </div>
    </div>
  );
};

export default function Footer() {
  return (
    <motion.div
      className="flex w-full justify-center items-center text-xs sm:text-sm md:text-md font-bold px-6 pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 30, delay: 0.5 }}
    >
      <Copyright />
    </motion.div>
  );
}
