# A statically generated blog example using Next.js, Markdown, and TypeScript

This is the existing [blog-starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) plus TypeScript.

This example showcases Next.js's [Static Generation](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) feature using Markdown files as the data source.

The blog posts are stored in `/_posts` as Markdown files with front matter support. Adding a new Markdown file in there will create a new blog post.

To create the blog posts we use [`remark`](https://github.com/remarkjs/remark) and [`remark-html`](https://github.com/remarkjs/remark-html) to convert the Markdown files into an HTML string, and then send it down as a prop to the page. The metadata of every post is handled by [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and also sent in props to the page.

## Cloudflare Pages 部署

本仓库使用静态导出：`npm run build` 会生成 `out/`，包含首页、所有 Markdown
文章页面、404 页面和静态资源。图片直接从 `public/assets/` 发布，无需 Next.js 图片服务器。

2026-10-16 的失败日志中，`next build` 已成功，失败的是后续的
`npx wrangler deploy`：Workers 自动配置拒绝 Next.js 14.1.0，并要求至少 14.2.35。
该命令走的是 Workers 部署流程；将 `.next` 改名或仅升级版本并不能把它变成 Pages 项目。

本次采用 Next.js 15.5.28 和 React 19，适配异步路由参数并同步更新 npm 锁文件。
选择 15.5 系列是为了使用已修补的维护版本，同时避免迁移到 16 的额外改动；
[Next.js 14 已停止支持](https://nextjs.org/support-policy)，15.5.28 包含
[2026-10-14 安全更新](https://nextjs.org/blog/nextjs-security-update-october-14-2026)。

在 Cloudflare 控制台选择 **Workers & Pages → Create application → Pages →
Import an existing Git repository**，连接 `zoujack018/personal_blog`，使用以下设置：

| 设置 | 值 |
| --- | --- |
| Production branch | `main`（合并修复 PR 后） |
| Root directory | 留空，使用仓库根目录 |
| Framework preset | `Next.js (Static HTML Export)` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node.js | `24.18.0`，由仓库 `.node-version` 指定 |

若控制台设置了 `NODE_VERSION`，也将其设为 `24.18.0`。使用 Pages 的 Git 集成自动发布，
无需填写 `npx wrangler deploy`。如果界面要求填写 Workers 的 Deploy command，
请返回并新建 **Pages** 项目。此仓库不需要 OpenNext、Pages Functions 或 `nodejs_compat`。

可先将修复分支设为 Pages 预览分支检查；生产分支保留 `main`，待 PR 合并后再发布。
部署完成后先检查实际分配的 `*.pages.dev` 地址，再在该 Pages 项目的 Custom domains
中添加自己的域名。不要把 `.next/` 作为静态发布目录。

详见 [Cloudflare 静态 Next.js 部署指南](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)。

### Pages CMS 与本地验证

现有 `.pages.yml` 保留：文章位于 `_posts/*.md`，媒体存入 `public/assets`，
公开路径为 `/assets`。在 [Pages CMS](https://app.pagescms.org) 中选择此仓库及目标分支，
保存内容会提交到 GitHub；提交进入 `main` 后，Pages 会重新构建并发布。
文章网址仍为 `/posts/<文件名去掉 .md>`，新增文章会在下一次构建时自动生成。
编辑时请保留示例文章中的标题、日期、封面、作者姓名与图片及 `ogImage.url` 字段。

使用 `.node-version` 指定的 Node.js 后运行：

```bash
npm ci
npm run build
```

检查 `out/index.html`、`out/404.html`、`out/posts/*.html` 及 `out/assets/`。
开发时使用 `npm run dev`；静态生产预览应通过静态文件服务器提供 `out/`，
`next start` 不支持 `output: "export"`。构建中的 Inter 字体需要访问 Google Fonts。
现有 `metadataBase` 警告不会阻止部署；确定最终域名后，可在 `src/app/layout.tsx`
设置它以生成正确的社交分享图片绝对地址。

Pages CMS 的内容编辑不依赖 Next.js Draft Mode。静态站点不提供服务器预览接口、
API 或请求时动态渲染；`/posts/preview` 只是模板中的一篇文章。

截至本次验证，`npm audit` 仍报告 13 项告警（6 high、7 moderate），涉及
Tailwind 的匹配/选择器依赖、Next.js 内部的 PostCSS 以及 gray-matter 的 YAML
依赖链。本次仅应用版本范围内的兼容修复；未强制迁移 Tailwind 4 / Next.js 16
或降级 gray-matter。线上只发布 `out/` 静态文件，但构建依赖仍需后续维护。

## Demo

[https://next-blog-starter.vercel.app/](https://next-blog-starter.vercel.app/)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/blog-starter)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/blog-starter&project-name=blog-starter&repository-name=blog-starter)

### Related examples

- [WordPress](/examples/cms-wordpress)
- [DatoCMS](/examples/cms-datocms)
- [Sanity](/examples/cms-sanity)
- [TakeShape](/examples/cms-takeshape)
- [Prismic](/examples/cms-prismic)
- [Contentful](/examples/cms-contentful)
- [Strapi](/examples/cms-strapi)
- [Agility CMS](/examples/cms-agilitycms)
- [Cosmic](/examples/cms-cosmic)
- [ButterCMS](/examples/cms-buttercms)
- [Storyblok](/examples/cms-storyblok)
- [GraphCMS](/examples/cms-graphcms)
- [Kontent](/examples/cms-kontent)
- [Umbraco Heartcore](/examples/cms-umbraco-heartcore)
- [Builder.io](/examples/cms-builder-io)
- [TinaCMS](/examples/cms-tina/)
- [Enterspeed](/examples/cms-enterspeed)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example blog-starter blog-starter-app
```

```bash
yarn create next-app --example blog-starter blog-starter-app
```

```bash
pnpm create next-app --example blog-starter blog-starter-app
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)! If it doesn't work, post on [GitHub discussions](https://github.com/vercel/next.js/discussions).

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

# Notes

`blog-starter` uses [Tailwind CSS](https://tailwindcss.com) [(v3.0)](https://tailwindcss.com/blog/tailwindcss-v3).
