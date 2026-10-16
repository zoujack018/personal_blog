# Compound

一面日历看板：https://zoujack018.us.ci

每天一篇文章，在看板上贴成一张便利贴；点开是一张像 Word 文档那样的 A4 纸。Next.js 静态导出，推送到 `main` 之后由 Cloudflare 自动构建、上线。

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

- 日期决定便利贴贴在哪一格，也决定网址（`/2026/10/16/`）。同一天放两篇，构建会直接报错。
- 也可以在 [Pages CMS](https://app.pagescms.org) 里写，字段按 `.pages.yml` 显示。
- 图片放在 `public/assets/`，文中写 `/assets/文件名`。
- 中文里的引号用“”，不要用英文直引号。

## 页面

| 地址 | 内容 |
|---|---|
| `/` | 本月的看板 |
| `/2026/10/` | 某个月的看板，从第一篇所在的月到本月，每月一页 |
| `/2026/10/16/` | 文章：灰色桌面上的一张 A4 纸，可以直接打印 |
| `/archive/` | 归档 |
| `/about/` | 关于，内容在 `_pages/about.md` |
| `/feed.xml` | RSS |

一篇文章都没有也能构建：看板是空的，`/0000/00/00/` 是一个占位的 404 页。

## 设计

- 字体：Inter（自托管，带光学尺寸轴，在 `src/app/layout.tsx` 引入），中文跟随系统（苹方、思源黑体、微软雅黑）。
- 颜色：只有黑白灰，全在 `src/app/globals.css` 顶部的变量里，深色模式跟随系统。
- 看板（`src/components/MonthBoard.tsx`）：空位是浅灰格子，还没到的日子只有一圈细线，今天是黑色的；写了文章的日子是一张白色便利贴，按日期微微贴歪，鼠标放上去会揭起来摆正。格子角上的小字是节日和节气。
- 入场动画是 `globals.css` 里的 `@keyframes pin`（看板）和 `sheet-in`（文档页），以后改加载动画从这里动手。
- 文档页（`src/components/DocSheet.tsx`）：宽度和最小高度都按 A4 算，打印时只留那张纸。
- 站点名称、标语、是否允许搜索引擎收录：`src/lib/site.ts`
- 图标：改 `public/favicon.svg` 或 `scripts/icons/touch-icon.svg`，再运行 `scripts/icons/make-icons.sh`

## 本地预览

```bash
npm install
npm run dev
```

然后打开 http://localhost:3000 。开发模式下，打开不存在的日期会报 500，这是 Next.js 开发服务器的检查；上线后是正常的 404 页。

## 部署

推送到 `main` 即可。Cloudflare 按项目里配置的构建命令生成 `out/`，再把它作为静态资源发布（见 `wrangler.jsonc`）。构建用的 Node 版本固定在 `.node-version`。
