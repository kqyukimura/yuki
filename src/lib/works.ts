import { getCollection, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'works'>;
export type Chapter = CollectionEntry<'chapters'>;
export type Essay = CollectionEntry<'essays'>;

/** 生产构建时隐藏草稿，dev 下依然可见，方便边写边预览。 */
const showDrafts = import.meta.env.DEV;
const notDraft = (e: { data: { draft?: boolean } }) => showDrafts || !e.data.draft;

/**
 * 统计字数。中文按字符算，英文按词算，跳过代码块和图片/链接地址。
 * 这是同人站的常规口径，和 AO3 的 word count 不完全一致但更贴合中文。
 */
export function countWords(raw = ''): number {
	const text = raw
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/^---[\s\S]*?---/, ' ');
	const cjk = text.match(/[一-鿿㐀-䶿぀-ヿ가-힯]/g)?.length ?? 0;
	const latin = text.match(/[A-Za-z0-9]+(?:['’\-][A-Za-z0-9]+)*/g)?.length ?? 0;
	return cjk + latin;
}

/** 12345 → "1.2 万字"；800 → "800 字" */
export function formatWords(n: number): string {
	if (n >= 10000) return `${(n / 10000).toFixed(1)} 万字`;
	return `${n} 字`;
}

/** 所有作品，按发布时间倒序 */
export async function getWorks(): Promise<Work[]> {
	const works = await getCollection('works', notDraft);
	return works.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 所有章节，按 order 升序 */
export async function getAllChapters(): Promise<Chapter[]> {
	const chapters = await getCollection('chapters', notDraft);
	return chapters.sort((a, b) => a.data.order - b.data.order);
}

/** 从章节 id `<作品>/<章节>` 里取出作品 slug */
export function workSlugOf(chapter: Chapter): string {
	return chapter.id.slice(0, chapter.id.indexOf('/'));
}

/** 从章节 id 里取出章节自身的 slug */
export function chapterSlugOf(chapter: Chapter): string {
	return chapter.id.slice(chapter.id.indexOf('/') + 1);
}

/** 某个作品的章节，按 order 升序 */
export async function getChaptersOf(workId: string): Promise<Chapter[]> {
	const all = await getAllChapters();
	return all.filter((c) => workSlugOf(c) === workId);
}

export interface WorkStats {
	/** 没有 chapters/ 的就是短篇，正文直接写在 index.md */
	isOneshot: boolean;
	chapterCount: number;
	wordCount: number;
}

/** 汇总一个作品的章节数和总字数（短篇算 index.md 正文） */
export async function getStats(work: Work): Promise<WorkStats> {
	const chapters = await getChaptersOf(work.id);
	if (chapters.length === 0) {
		return { isOneshot: true, chapterCount: 0, wordCount: countWords(work.body) };
	}
	return {
		isOneshot: false,
		chapterCount: chapters.length,
		wordCount: chapters.reduce((sum, c) => sum + countWords(c.body), 0),
	};
}

/** 作品 + 统计，列表页用 */
export async function getWorksWithStats(): Promise<(Work & { stats: WorkStats })[]> {
	const works = await getWorks();
	return Promise.all(works.map(async (w) => ({ ...w, stats: await getStats(w) })));
}

/** 所有随笔，按发布时间倒序 */
export async function getEssays(): Promise<Essay[]> {
	const essays = await getCollection('essays', notDraft);
	return essays.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 收集全站标签及出现次数，按热度排序 */
export async function getTagCounts(): Promise<{ tag: string; count: number }[]> {
	const [works, essays] = await Promise.all([getWorks(), getEssays()]);
	const counts = new Map<string, number>();
	for (const e of [...works, ...essays]) {
		for (const t of e.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
	}
	return [...counts.entries()].map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh'));
}

/** 收集所有圈子及作品数 */
export async function getFandomCounts(): Promise<{ fandom: string; count: number }[]> {
	const works = await getWorks();
	const counts = new Map<string, number>();
	for (const w of works) {
		for (const f of w.data.fandom) counts.set(f, (counts.get(f) ?? 0) + 1);
	}
	return [...counts.entries()].map(([fandom, count]) => ({ fandom, count }))
		.sort((a, b) => b.count - a.count || a.fandom.localeCompare(b.fandom, 'zh'));
}

/** 按发布年份分组，年份倒序。列表页的归档视图用。 */
export function groupByYear<T extends { data: { pubDate: Date } }>(
	entries: T[],
): { year: number; items: T[] }[] {
	const groups = new Map<number, T[]>();
	for (const e of entries) {
		const y = e.data.pubDate.getFullYear();
		if (!groups.has(y)) groups.set(y, []);
		groups.get(y)!.push(e);
	}
	return [...groups.entries()]
		.map(([year, items]) => ({ year, items }))
		.sort((a, b) => b.year - a.year);
}
