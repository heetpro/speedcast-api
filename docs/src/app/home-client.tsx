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
                position: "relative",
                [side]: 28,
                // top: 0,
                // bottom: 0,
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
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    margin: 0,
                    padding: 0,
                    whiteSpace: "nowrap"
                }}
                animate={{ y: ["0%", "-100%"] }}
                transition={{
                    repeat: Infinity,
                    duration: 300,
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
        <div className="flex flex-col md:flex-row w-full min-h-screen">
            <div className="w-full md:w-[50%] px-6 md:px-12 py-12 md:py-0 flex items-center justify-center">
                <div className="space-y-8 md:space-y-10 max-w-xl">
                    <div className="space-y-4 md:space-y-6 text-center md:text-left">
                        <div>
                            <div className="inline-flex items-center mb-3 underline rounded-full text-sm md:text-base font-medium text-white/80">
                                version 1.0.0
                            </div>
                            <h1 className="text-4xl md:text-6xl tracking-tight bg-clip-text text-white druk-super uppercase">Speedcast</h1>
                        </div>
                        <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto md:mx-0">
                            A blazing fast API client with built-in caching, rate limiting,
                            and TypeScript support for modern JavaScript applications.
                        </p>
                    </div>

                    <div className="space-y-6 md:space-y-8">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <Link
                                href="/docs/getting-started/introduction"
                                className="transition-all flex items-center border-2 border-white bg-white inter rounded-3xl text-black px-6 md:px-8 py-3 md:py-4 gap-2 hover:gap-6 font-medium w-full sm:w-auto text-center justify-center"
                            >
                                Get Started <BsArrowDownRight className="-rotate-45 text-xl" />
                            </Link>
                            <Link
                                href="/docs/methods/get"
                                className="transition-all flex items-center border-2 border-white bg-transparent inter rounded-3xl text-white px-6 md:px-8 py-3 md:py-4 gap-2 hover:gap-6 font-medium w-full sm:w-auto text-center justify-center"
                            >
                                API Reference <BsArrowDownRight className="-rotate-45 text-xl" />
                            </Link>
                        </div>

                        <div className="pt-2">
                            <h3 className="text-xl md:text-2xl druk-super font-medium text-white mb-3 text-center md:text-left">Installation</h3>
                            <Tabs
                                defaultValue="npm"
                                value={activeTab}
                                onValueChange={(value) => setActiveTab(value as InstallTab)}
                                className="w-full max-w-lg mx-auto md:mx-0"
                            >
                                <TabsList className="grid grid-cols-4 bg-[#1a1a1a] mb-2">
                                    <TabsTrigger className="text-sm md:text-base py-2" value="npm">npm</TabsTrigger>
                                    <TabsTrigger className="text-sm md:text-base py-2" value="yarn">yarn</TabsTrigger>
                                    <TabsTrigger className="text-sm md:text-base py-2" value="pnpm">pnpm</TabsTrigger>
                                    <TabsTrigger className="text-sm md:text-base py-2" value="bun">bun</TabsTrigger>
                                </TabsList>
                                <div className="bg-[#151515] rounded-md border border-white/10 overflow-hidden shadow-lg">
                                    <div className="flex items-center justify-between px-2 py-2 bg-[#1a1a1a] border-b border-white/10">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                    </div>
                                    <pre className="p-4 text-white/90 text-sm md:text-base font-mono overflow-x-auto">
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
                            <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                                <Link href="https://github.com/heetpro/speedcast-api" className="border-2 border-white rounded-full p-4 hover:p-3 transition-all duration-300">
                                    <ImGithub className="w-5 h-5 md:w-6 md:h-6" />
                                </Link>
                                <Link href="https://x.com/heetprox"
                                    className="border-2 border-white rounded-full p-4 hover:p-3 transition-all duration-300"
                                >
                                    <FaXTwitter className="w-5 h-5 md:w-6 md:h-6" />
                                </Link>
                                <Link href="https://www.npmjs.com/package/speedcast-api"
                                    className="border-2 border-white rounded-full p-4 hover:p-3 transition-all duration-300"
                                >
                                    <SiNpm className="w-5 h-5 md:w-6 md:h-6" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[40vh] md:h-screen w-full md:w-[50%] flex justify-evenly relative overflow-hidden">
                <div className="hidden ml-5 md:block">
                    <VerticalText text="FAST CLIENT API" side="right" />
                </div>

                <div className="block md:hidden absolute inset-0">
                    <div className="absolute left-2 top-0 h-full flex items-center">
                        <p className="druk-super text-3xl rotate-180 text-white font-bold" style={{ writingMode: 'vertical-rl' }}>SPEED</p>
                    </div>
                    <div className="absolute right-2 top-0 h-full flex items-center">
                        <p className="druk-super text-3xl rotate-180 text-white font-bold" style={{ writingMode: 'vertical-rl' }}>FAST API </p>
                    </div>
                </div>

                <div className="w-full h-full flex items-center justify-center md:justify-start">
                    <Image
                        src="/banner.svg"
                        alt="Speed cast API Visualization"
                        width={1200}
                        height={630}
                        className="h-full w-auto sm:aspect-auto aspect-video object-contain max-w-none"
                        priority
                    />
                </div>
            </div>
        </div>
    );
} 