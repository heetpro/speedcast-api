// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true; // noLink will create a route segment (section) but cannot be navigated
  items?: EachRoute[];
};

export const ROUTES: EachRoute[] = [
  {
    title: "Getting Started",
    href: "/getting-started",
    noLink: true,
    items: [
      { title: "Introduction", href: "/introduction" },
      {
        title: "Installation",
        href: "/installation",
      },
      { title: "Configuration Options", href: "/options" },
    ],
  },
  {
    title: "Methods",
    href: "/methods",
    noLink: true,
    items: [
      { title: "Get", href: "/get" },
      { title: "Post", href: "/post" },
      { title: "Delete", href: "/delete" },
      { title: "Patch", href: "/patch" },
      { title: "Put", href: "/put" },
      { title: "Other", href: "/other" },
    ],
  },
  {
    title: "Advanced Features",
    href: "/others",
    noLink: true,
    items: [
      { title: "Smart Caching", href: "/caching" },
      { title: "Rate Limiting", href: "/rate-limiting" },
      { title: "Request Deduplication", href: "/deduplication" },
      { title: "Auto Retry", href: "/retry" },
      { title: "Examples", href: "/example" },
      { title: "Performance Comparison", href: "/performance" },
    ],
  },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
