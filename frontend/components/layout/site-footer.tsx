export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background py-10">
      <div className="container flex flex-col gap-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-foreground">Lenjoy 资源分享站</p>
          <p className="mt-1 max-w-md text-xs">
            汇聚优质学习资源与实用工具，精选网站导航，助力高效学习与成长。
          </p>
          <p className="mt-2 max-w-md text-[10px] leading-relaxed text-muted-foreground/80">
            免责声明：本站资源均来源于公开互联网，仅供学习与交流使用，不保证内容的时效与完整性。若您认为本站收录内容涉及侵权，请发送邮件至
            <a
              href="mailto:wheng0913@gmail.com"
              className="underline decoration-dotted underline-offset-2 hover:text-foreground"
            >
              {" "}
              wheng0913@gmail.com{" "}
            </a>
            ，我们将在核实后及时处理删除。
          </p>
        </div>
        <div className="flex gap-6">
          <a
            href="mailto:wheng0913@gmail.com"
            className="transition hover:text-foreground"
          >
            联系站长
          </a>
          <a href="/about" className="transition hover:text-foreground">
            关于本站
          </a>
          <a href="/terms" className="transition hover:text-foreground">
            使用条款
          </a>
        </div>
        <p className="text-xs">
          © {new Date().getFullYear()} Lenjoy. 保留所有权利。
        </p>
      </div>
    </footer>
  );
}
