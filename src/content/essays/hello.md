---
title: 开张
description: 关于这个站为什么存在，以及我打算怎么用它。
pubDate: 2026-08-21
tags:
  - 杂谈
---

随笔和作品用的是两套不同的字段：随笔只需要标题、简介、日期和标签，
不需要填圈子、分级、CP 这些同人专用的元信息。

想让某篇暂时不发布，在 frontmatter 里加一行 `draft: true`。
本地 `npm run dev` 时仍然能看到它，但 `npm run build` 不会把它构建进站点。
