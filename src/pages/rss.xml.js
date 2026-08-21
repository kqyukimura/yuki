import rss from '@astrojs/rss';
import { url } from '../lib/url';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getWorks, getEssays } from '../lib/works';

export async function GET(context) {
	const [works, essays] = await Promise.all([getWorks(), getEssays()]);

	// 作品和随笔混在一条订阅里，按时间倒序
	const items = [
		...works.map((w) => ({
			title: w.data.title,
			description: w.data.summary,
			pubDate: w.data.pubDate,
			link: url(`/works/${w.id}/`),
			categories: [...w.data.fandom, ...w.data.tags],
		})),
		...essays.map((e) => ({
			title: e.data.title,
			description: e.data.description,
			pubDate: e.data.pubDate,
			link: url(`/essays/${e.id}/`),
			categories: e.data.tags,
		})),
	].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		// 频道链接要带上 base，否则指向的是站点根目录而不是本站
		site: new URL(url("/"), context.site),
		items,
		customData: '<language>zh-CN</language>',
	});
}
