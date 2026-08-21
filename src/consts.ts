// ─────────────────────────────────────────────────────────────
// 站点全局配置。改站名、简介、导航、社交链接都在这个文件。
// ─────────────────────────────────────────────────────────────

/** 站名，显示在页头和浏览器标签 */
export const SITE_TITLE = 'yuki';
/** 站点简介，用于首页副标题、RSS、搜索结果摘要 */
export const SITE_DESCRIPTION = '存放我写的同人与随笔。';
/** 首页竖排引言。留空字符串就不显示。手机上会自动隐藏 */
export const SITE_QUOTE = '把写下来的都留在这里';

/** 你的笔名，显示在页脚 */
export const AUTHOR = '晏茶殊';

/** 页头导航。href 写成不带 base 的站内路径，渲染时会自动加前缀。 */
export const NAV = [
	{ href: '/', label: '首页' },
	{ href: '/works/', label: '作品' },
	{ href: '/essays/', label: '随笔' },
	{ href: '/about/', label: '关于' },
];

/**
 * 页脚社交链接。留空数组就不显示。
 * 这里放的是站外链接，写完整 URL。
 */
export const SOCIAL: { href: string; label: string }[] = [
	// { href: 'https://github.com/kqyukimura', label: 'GitHub' },
	// { href: 'mailto:jiangkaiqian2@gmail.com', label: '邮箱' },
];
