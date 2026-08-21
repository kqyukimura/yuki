import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** 分级：从宽到严，顺序会用在筛选器上 */
export const RATINGS = ['全年龄', '青少年向', '成人向'] as const;
/** 连载状态 */
export const STATUSES = ['连载中', '已完结', '暂停'] as const;

/**
 * 作品集合。每个作品是一个文件夹：
 *   works/<slug>/index.md          元信息（短篇的正文也写在这里）
 *   works/<slug>/chapters/*.md     章节，长篇才需要
 * 有没有 chapters/ 决定了作品页渲染成「正文」还是「简介 + 目录」。
 */
const works = defineCollection({
	loader: glob({
		base: './src/content/works',
		pattern: '*/index.{md,mdx}',
		// 去掉尾部的 /index，让 id 就是作品 slug
		generateId: ({ entry }) => entry.replace(/\/index\.mdx?$/, ''),
	}),
	schema: ({ image }) =>
		z.object({
			/** CMS 用来区分作品与章节的标记，本地手写时可省略 */
			type: z.literal('work').optional(),
			/** 文件夹名，同时决定网址。CMS 用它建目录；本地手写时可省略 */
			slug: z.string().optional(),
			title: z.string(),
			/** 简介，会显示在列表卡片和作品页 */
			summary: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			/** 圈子，单个字符串或数组都可以 */
			fandom: z
				.union([z.string(), z.array(z.string())])
				.transform((v) => (Array.isArray(v) ? v : [v])),
			/** CP，习惯上用 A/B 或 A×B */
			relationships: z.array(z.string()).default([]),
			characters: z.array(z.string()).default([]),
			rating: z.enum(RATINGS).default('全年龄'),
			/** 预警 / CW，会在正文前显著提示 */
			warnings: z.array(z.string()).default([]),
			status: z.enum(STATUSES).default('已完结'),
			tags: z.array(z.string()).default([]),
			heroImage: image().optional(),
			/** true 则不会被构建进站点 */
			draft: z.boolean().default(false),
			/** 首页置顶 */
			featured: z.boolean().default(false),
		}),
});

/** 章节集合。id 形如 `<作品slug>/<章节slug>`。 */
const chapters = defineCollection({
	loader: glob({
		base: './src/content/works',
		pattern: '*/chapters/*.{md,mdx}',
		generateId: ({ entry }) =>
			entry.replace(/\.mdx?$/, '').replace('/chapters/', '/'),
	}),
	schema: z.object({
		/** CMS 用来区分作品与章节的标记 */
		type: z.literal('chapter').optional(),
		/** 文件名，同时决定网址。CMS 用它命名章节文件 */
		slug: z.string().optional(),
		/** 所属作品的 slug，CMS 用它决定章节存到哪个文件夹 */
		work: z.string().optional(),
		title: z.string(),
		/** 章节顺序，决定目录排序和上下章导航 */
		order: z.number(),
		pubDate: z.coerce.date(),
		/** 章节前注，可选 */
		summary: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

/** 随笔 / 博客 */
const essays = defineCollection({
	loader: glob({ base: './src/content/essays', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			/** 文件名，同时决定网址。CMS 用它命名文件；本地手写时可省略 */
			slug: z.string().optional(),
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			heroImage: image().optional(),
			draft: z.boolean().default(false),
		}),
});

export const collections = { works, chapters, essays };
