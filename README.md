# 个人站

用 Astro 搭的同人作品 + 随笔站，纯静态，推送到 GitHub 自动部署。

## 在网页上写作品（推荐）

后台地址：<https://kqyukimura.github.io/yuki/admin/>

第一次使用要先建一个访问令牌：

1. 打开后台，点 **「使用访问令牌登录」**
2. 弹窗里会给出一个 GitHub 令牌生成链接，**所需权限已经预选好了**，点进去直接创建
   - 类型选 fine-grained，Repository access 只勾 `kqyukimura/yuki`
   - Permissions 需要 **Contents: Read and write**
3. 把生成的令牌粘回弹窗

令牌存在浏览器本地，换设备要重新填一次。

后台里三个栏目对应三种内容：

| 栏目 | 用来做什么 |
|---|---|
| **作品** | 建一篇作品。短篇直接把正文写在「正文 / 前言」里；长篇这里只写前言，正文去「章节」加 |
| **章节** | 长篇的每一章。「所属作品」是下拉框，从已建好的作品里选 |
| **随笔** | 杂谈、创作手记 |

分级、状态是下拉框，圈子 / CP / 标签 / 预警是标签输入，封面图可以直接拖进去。
点保存就自动提交到 GitHub，约半分钟后线上生效。

> **关于「网址名」字段**：它同时是文件夹名和网址，只能用小写英文字母、数字和连字符。
> 不让它从中文标题自动生成，是因为中文 slugify 会产出一长串百分号编码的丑网址。
> **建好之后不要再改**，否则已经分享出去的旧链接会失效。

## 本地写作

更习惯用编辑器的话也可以照旧在本地写，两种方式随时混用——
CMS 改的就是仓库里的同一批 Markdown 文件。


CMS 建出来的文件会多带 `type`、`slug`（章节还有 `work`）三个字段——
它们是 CMS 用来判断文件归属和存放位置的，手写时可以省略，不影响渲染。

## 日常使用

```bash
npm run dev      # 本地预览，改文件自动刷新，草稿也可见
npm run build    # 生产构建，输出到 dist/，会过滤掉草稿
npm run preview  # 预览构建结果
```

## 发一篇短篇

在 `src/content/works/` 下新建一个文件夹，里面放 `index.md`：

```
src/content/works/我的短篇/index.md
```

```markdown
---
title: 作品名
summary: 一句话简介，会显示在列表和作品页
pubDate: 2026-08-21
fandom: 圈子名                    # 多个圈子写成 YAML 数组
relationships: [甲/乙]
characters: [甲, 乙]
rating: 全年龄                     # 全年龄 | 青少年向 | 成人向
warnings: []                      # 有预警就填，会在正文前显著提示
status: 已完结                     # 连载中 | 已完结 | 暂停
tags: [日常, 温馨]
featured: false                   # true 则在首页置顶
draft: false                      # true 则只在本地可见，不会发布
---

正文写在这里。
```

## 发一篇长篇

同样建文件夹，但多一个 `chapters/` 子目录：

```
src/content/works/我的长篇/
  index.md                 ← 元信息 + 前言（会显示在目录上方）
  chapters/
    01-xxx.md
    02-xxx.md
```

章节的 frontmatter 只要四个字段：

```markdown
---
title: 第一章　标题
order: 1              # 排序靠这个，和文件名无关，插章不用重命名
pubDate: 2026-08-21
summary: 章节前注，可选
---
```

**有没有 `chapters/` 决定了作品页长什么样**：没有就是短篇，`index.md` 的正文直接当作品正文；
有就变成「简介 + 章节目录」，并自动生成上一章/下一章导航。

字数、章节数、更新时间都是自动算的，不用手填。

## 发一篇随笔

`src/content/essays/` 下直接放 md 文件，字段简单得多：

```markdown
---
title: 标题
description: 摘要
pubDate: 2026-08-21
tags: [杂谈]
---
```

## 正文排版小抄

- 段落自动首行缩进两字
- 单独一行写 `***` → 渲染成居中的场景分隔线
- 不想缩进的段落，用 `<p class="no-indent">…</p>`

## 要改的地方

| 想改什么 | 改哪个文件 |
|---|---|
| 站名、简介、笔名、导航、社交链接 | `src/consts.ts` |
| 站点网址 / base（影响 RSS、sitemap） | `astro.config.mjs` |
| 配色、字体、行距 | `src/styles/global.css` 顶部的 `:root` |
| 关于页内容 | `src/pages/about.astro` |

## ⚠️ 站内链接必须用 `url()`

本站部署在 `https://kqyukimura.github.io/yuki`，挂在 **`/yuki` 子路径**下。
Astro **不会**自动给模板里写死的链接加这个前缀，所以：

```astro
---
import { url } from '../lib/url';
---
<a href={url('/works/')}>作品</a>   <!-- ✅ 正确 -->
<a href="/works/">作品</a>          <!-- ❌ 会 404 -->
```

站外链接不要用 `url()`，直接写完整 URL。

> 如果以后把仓库改名成 `kqyukimura.github.io`，站点就会挂在根目录，
> 那时删掉 `astro.config.mjs` 里的 `base` 即可，`url()` 会自动变成透传，不用改页面。

## 部署

已经配好 `.github/workflows/deploy.yml`。首次部署前要在 GitHub 仓库里
**Settings → Pages → Build and deployment → Source 选 "GitHub Actions"**。

之后每次 `git push` 就会自动构建发布，网址是 <https://kqyukimura.github.io/yuki>。
