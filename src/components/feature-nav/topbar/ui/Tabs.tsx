"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export type TabType = {
  label: string;
  link: string;
  className?: string;
};

interface TabsProps {
  tabs: TabType[];
}

export default function Tabs({ tabs }: TabsProps) {
  const currentPath = usePathname();
  return (
    <div className="flex gap-2">
      {tabs.map(({ label, link, className }) => {
        const onPath = link === currentPath; // True if tab corresponds to current path
        return (
          <Link className={`flex items-center `} key={label} href={link}>
            <motion.div
              className={`p-2 rounded-lg ${className} ${
                onPath && "text-[#64B6AC]"
              }
              text-lg font-semibold`}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              {label}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
