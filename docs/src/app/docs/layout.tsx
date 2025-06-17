import { Leftbar } from "@/components/leftbar";
import { Navbar } from "@/components/navbar";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-start w-[70vw]  mx-auto gap-8 dark:bg-background">
      <Navbar />
      <Leftbar key="leftbar" />
      <div className="flex-[5.25]">{children}</div>
    </div>
  );
}
