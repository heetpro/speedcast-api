import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Search from "./search";
import Anchor from "./anchor";
import { SheetLeftbar } from "./leftbar";
import { page_routes } from "@/lib/routes-config";
import { SheetClose } from "@/components/ui/sheet";
import { ImGithub } from "react-icons/im";
import { FaXTwitter } from "react-icons/fa6";

export const NAVLINKS = [
  {
    title: "Docs",
    href: `/docs${page_routes[0].href}`,
  },
  {
    title: "npm",
    href: "https://www.npmjs.com/package/speedcast-api",
  },
  {
    title: "Playground",
    href: "https://speedcast.heet.pro",
  },
];

export function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 border-b h-16 z-50 bg-background">
      <div className=" mx-auto w-[70vw] h-full flex items-center justify-between md:gap-2">
        <div className="flex items-center gap-5">
          <SheetLeftbar />
          <div className="flex items-center gap-6">
            <div className="sm:flex hidden">
              <Logo />
            </div>
            <div className="lg:flex hidden items-center gap-4 text-sm font-medium mt-2 uto-regular text-muted-foreground">
              <NavMenu />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Search />
            <div className="flex ml-2.5 sm:ml-0">
              <Link
                href="https://github.com/heetpro/speedcast-api"
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <ImGithub className="h-[1.1rem] w-[1.1rem]" />
              </Link>
              <Link
                href="https://x.com/heetprox"
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                })}
              >
                <FaXTwitter className="h-[1.1rem] w-[1.1rem]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <h2 className="text-xl druk-super uppercase ">Speedcast</h2>
    </Link>
  );
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {NAVLINKS.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName="!text-primary dark:font-medium font-semibold"
            absolute
            className="flex items-center gap-1 text-stone-300/85"
            href={item.href}
          >
            {item.title}
          </Anchor>
        );
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        );
      })}
    </>
  );
}
