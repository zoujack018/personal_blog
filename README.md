# Compound

一本每天翻一页的日历式博客：https://zoujack018.us.ci

Next.js 静态导出，推送到 `main` 之后由 Cloudflare 自动构建、上线。

## 写一篇文章

在 `_posts/` 里新建一个以日期命名的文件，比如 `2026-10-16.md`，一天一篇：

```markdown
---
title: 标题
date: 2026-10-16
excerpt: 一两句摘要。可以不写，不写就取正文第一段
---

正文用 Markdown，支持表格和脚注[^1]。

[^1]: 出处写在这里。
```

- 日期决定文章在日历上的位置和网址（`/2026/10/16/`）。同一天放两篇，构建会直接报错。
- 也可以在 [Pages CMS](https://app.pagescms.org) 里写，字段按 `.pages.yml` 显示。
- 图片放在 `public/assets/`，文中写 `/assets/文件名`。
- 中文里的引号用“”，不要用英文直引号。

## 页面

| 地址 | 内容 |
|---|---|
| `/` | 最新一篇，下面是往日列表 |
| `/calendar/`、`/2026/10/` | 月历：有文章的日子写着标题，每格带农历、节气和节日 |
| `/2026/10/16/` | 文章 |
| `/archive/` | 归档 |
| `/about/` | 关于，内容在 `_pages/about.md` |
| `/feed.xml` | RSS |

- 站点名称、标语、是否允许搜索引擎收录：`src/lib/site.ts`
- 配色和排版：`src/app/globals.css` 顶部的变量，深色模式跟随系统
- 图标：改 `public/favicon.svg` 或 `scripts/icons/touch-icon.svg`，再运行 `scripts/icons/make-icons.sh`

## 本地预览

```bash
npm install
npm run build
python3 -m http.server 4321 --directory out
```

然后打开 http://localhost:4321 。

## 部署

推送到 `main` 即可。Cloudflare 按项目里配置的构建命令生成 `out/`，再把它作为静态资源发布（见 `wrangler.jsonc`）。构建用的 Node 版本固定在 `.node-version`。
