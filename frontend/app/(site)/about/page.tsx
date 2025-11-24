import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "关于本站 - Lenjoy 资源分享站",
  description: "让知识触手可及，让成长没有边界",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 标题区 */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary">🌟 关于本站</h1>
        <p className="text-lg text-muted-foreground">
          让知识触手可及，让成长没有边界
        </p>
      </div>

      {/* 垂直布局内容区 */}
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        {/* 使命卡片 */}
        <div className="rounded-xl border border-border bg-card shadow-lg">
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">📚 我们的使命</h2>
            <p className="leading-relaxed text-muted-foreground">
              我们致力于打造互联网上最优质的学习资源共享平台，汇聚各领域精选资源与实用工具，
              完全免费向所有用户开放。通过精心策展的内容和便捷的导航，帮助每一位学习者快速找到所需资源，
              提升学习效率，助力个人成长。
            </p>
          </div>
        </div>

        {/* 站长卡片 */}
        <div className="rounded-xl border border-border bg-card shadow-lg">
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">👨‍💻 站长介绍</h2>
            <div className="flex flex-col items-center gap-6 lg:flex-row">
              <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background">
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl">
                  👨‍💻
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    技术极客
                  </span>
                  <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    开源贡献者
                  </span>
                  <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    终身学习者
                  </span>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  十年全栈开发经验，开源社区活跃成员
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  热爱技术分享，致力于帮助更多人获取优质学习资源
                </p>
              </div>
            </div>
          </div>

          {/* 二维码区 */}
          <div className="border-t border-border px-6 pb-8 pt-6">
            <h3 className="mb-4 text-center text-lg font-semibold">
              扫码添加微信
            </h3>
            <div className="flex justify-center">
              <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-6">
                <div className="flex h-48 w-48 items-center justify-center bg-background text-6xl">
                  📱
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              添加请备注「乐享资源库」，添加微信后可申请加入【微信群】
              <br />
              获取更多资源和交流机会
            </p>
          </div>
        </div>

        {/* 更新日志卡片 */}
        <div className="rounded-xl border border-border bg-card shadow-lg">
          <div className="p-6">
            <h2 className="mb-8 text-center text-3xl font-bold">⏳ 更新日志</h2>

            {/* 时间轴项目 */}
            <div className="space-y-6">
              {/* 最新版本 */}
              <div className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-full before:w-0.5 before:bg-border">
                <div className="absolute left-0 top-2 -ml-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">V2.0 全新升级</h3>
                    <span className="text-sm text-muted-foreground">
                      2025-11-18
                    </span>
                  </div>
                  <p className="mb-3 text-muted-foreground">
                    全新的设计和架构，使用 Next.js 15
                    重构，带来更好的性能和用户体验
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                      新功能
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                      性能优化
                    </span>
                  </div>
                </div>
              </div>

              {/* 第一版本 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-2 -ml-1.5 h-3 w-3 rounded-full bg-muted ring-4 ring-background" />
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">第一个版本发布</h3>
                    <span className="text-sm text-muted-foreground">
                      2025-04-10
                    </span>
                  </div>
                  <p className="mb-3 text-muted-foreground">
                    我们发布了第一版本，感谢大家的支持！
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      版本发布
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 核心特性卡片 */}
        <div className="rounded-xl border border-border bg-card shadow-lg">
          <div className="p-6">
            <h2 className="mb-6 text-2xl font-semibold">✨ 核心特性</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl">
                  🎯
                </div>
                <div>
                  <h3 className="mb-1 font-medium">精选聚合</h3>
                  <p className="text-sm text-muted-foreground">
                    精心筛选各领域优质资源，为您节省搜索时间
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl">
                  🚀
                </div>
                <div>
                  <h3 className="mb-1 font-medium">快速导航</h3>
                  <p className="text-sm text-muted-foreground">
                    清晰的分类导航，快速找到所需工具和资源
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl">
                  💯
                </div>
                <div>
                  <h3 className="mb-1 font-medium">完全免费</h3>
                  <p className="text-sm text-muted-foreground">
                    所有资源完全免费开放，无需注册登录
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl">
                  🔄
                </div>
                <div>
                  <h3 className="mb-1 font-medium">持续更新</h3>
                  <p className="text-sm text-muted-foreground">
                    定期更新资源库，及时收录优质新资源
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 联系方式卡片 */}
        <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 text-center shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold">📮 联系我们</h2>
          <p className="mb-6 text-muted-foreground">
            如果您有优质资源推荐、问题反馈或合作建议，欢迎随时联系我们
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:wheng0913@gmail.com"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-medium transition-colors hover:bg-accent"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              邮件联系
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
