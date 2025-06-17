"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { BsArrowDownRight } from "react-icons/bs";
import { motion } from "framer-motion";
import { ImGithub } from "react-icons/im";
import { FaXTwitter } from "react-icons/fa6";
import { SiNpm } from "react-icons/si";
type InstallTab = "npm" | "yarn" | "pnpm" | "bun";

const VerticalText = ({ text, side }: { text: string; side: "left" | "right" }) => {
  return (
    <div
      style={{
        position: "absolute",
        [side]: 20,
        top: 0,
        bottom: 0,
        overflow: "hidden",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <motion.p
        className="druk-super text-9xl"
        style={{
          color: "white",
          fontWeight: "bold",
          letterSpacing: "0.2em",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          margin: 0,
          padding: 0,
          whiteSpace: "nowrap"
        }}
        animate={{ y: ["0%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 200,
          ease: "linear",
          repeatDelay: 0
        }}
      >
        {text} • {text} • {text} • {text} • {text} • {text} • {text}
      </motion.p>
    </div>
  );
};

export default function HomeClient() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<InstallTab>("npm");

  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const installCommands: Record<InstallTab, string> = {
    npm: "npm install speedcast-api",
    yarn: "yarn add speedcast-api",
    pnpm: "pnpm add speedcast-api",
    bun: "bun add speedcast-api"
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-[45%] mx-auto flex my-auto justify-center">
        <div className="space-y-10">
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center mb-3 underline rounded-full text-sm font-medium text-white/80">
                version 1.0.0
              </div>
              <h1 className="text-6xl  tracking-tight bg-clip-text text-white druk-super uppercase">Speedcast</h1>
            </div>
            <p className="text-xl text-white/70 max-w-xl inter">
              A blazing fast API client with built-in caching, rate limiting,
              and TypeScript support for modern JavaScript applications.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-3">
              <Link
                href="/docs/getting-started/introduction"
                className="transition-all flex items-center border-2 border-white   bg-white inter rounded-3xl text-black px-8 py-4 gap-2 hover:gap-6   font-medium"
              >
                Get Started <BsArrowDownRight className="-rotate-45 text-xl" />
              </Link>
              <Link
                href="/docs/methods/get"
                className="transition-all flex items-center border-2 border-white  bg-transparent inter rounded-3xl text-white px-8 py-4 gap-2 hover:gap-6   font-medium"
              >
                API Reference <BsArrowDownRight className="-rotate-45 text-xl" />
              </Link>
            </div>

            <div className="pt-2">
              <h3 className="text-2xl druk-super font-medium text-white mb-3">Installation</h3>
              <Tabs
                defaultValue="npm"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as InstallTab)}
                className="w-full max-w-lg"
              >
                <TabsList className="grid grid-cols-4 bg-[#1a1a1a] mb-2">
                  <TabsTrigger className="text-base py-2" value="npm">npm</TabsTrigger>
                  <TabsTrigger className="text-base py-2" value="yarn">yarn</TabsTrigger>
                  <TabsTrigger className="text-base py-2" value="pnpm">pnpm</TabsTrigger>
                  <TabsTrigger className="text-base py-2" value="bun">bun</TabsTrigger>
                </TabsList>
                <div className="bg-[#151515] rounded-md border border-white/10 overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between px-2 py-2 bg-[#1a1a1a] border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <pre className="p-4 text-white/90 text-base font-mono overflow-x-auto">
                    <code className="flex justify-between items-center">
                      <span className="ml-2">
                        <span className="text-green-400">$ </span>
                        <span className="text-blue-400">{activeTab}</span>
                        <span className="text-yellow-400"> {activeTab === "npm" ? "install" : "add"} </span>
                        <span className="text-purple-400">speedcast-api</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(installCommands[activeTab])}
                        className="text-white/60 hover:text-white transition-all p-1.5 rounded-md hover:bg-white/5"
                      >
                        {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                      </button>
                    </code>
                  </pre>
                </div>
              </Tabs>
              <div className="flex items-center gap-4 mt-4">
                <Link href="https://github.com/heetpro/speedcast-api" className="border-2 border-white rounded-full p-4 hover:p-3 transition-all duration-300">
                  <ImGithub className="w-6 h-6" />
                </Link>
                <Link href="https://x.com/heetprox"
                  className="border-2 border-white rounded-full p-4 hover:p-3 transition-all duration-300" 
                >
                  <FaXTwitter className="w-6 h-6" />
                </Link>
                <Link href="https://www.npmjs.com/package/speedcast-api"
                  className="border-2 border-white rounded-full p-4 hover:p-3 transition-all duration-300"
                >
                  <SiNpm className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-screen  w-[55%] relative overflow-hidden">

        <VerticalText text="FAST API • CLIENT API" side="right" />

        <div className="w-full h-full flex items-center justify-center">
          <Image
            src="/banner.svg"
            alt="Speed cast API Visualization"
            width={1200}
            height={630}
            className="h-screen w-auto object-contain max-w-none"
            priority
          />
        </div>
      </div>
    </div>
  );
} 