export interface MainNavItem {
    title: string;
    href: string;
    description?: string;
}

export const mainNavItems: MainNavItem[] = [
    { title: "首页", href: "/" },
    { title: "资源", href: "/articles" },
    { title: "资源网站导航", href: "/websites" },
    { title: "搜索", href: "/search" },
];
