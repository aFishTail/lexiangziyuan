import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { mainNavItems } from "@/lib/navigation";

import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MobileNav items={mainNavItems} />
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-base sm:text-lg">Lenjoy</span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              资源分享站
            </span>
          </Link>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {mainNavItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
        </div>
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
