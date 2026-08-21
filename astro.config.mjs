// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	// 站点源地址，不含子路径
	site: 'https://kqyukimura.github.io',
	// 仓库名不是 kqyukimura.github.io，所以站点挂在 /yuki 子路径下。
	// 注意：模板里写死的站内链接不会自动加这个前缀，一律走 src/lib/url.ts 的 url()。
	base: '/yuki',
	integrations: [mdx(), sitemap()],
});
