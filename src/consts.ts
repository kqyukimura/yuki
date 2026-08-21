// ─────────────────────────────────────────────────────────────
// 站点全局配置。
//
// 站名、简介、笔名、联系方式这些「内容型」配置放在
// src/data/site.json 里，可以直接在 CMS 后台的「站点设置」里改。
// 导航结构属于代码，仍然在这个文件里维护。
// ─────────────────────────────────────────────────────────────
import site from './data/site.json';

/** 站名，显示在页头和浏览器标签 */
export const SITE_TITLE = site.title;
/** 站点简介，用于首页副标题、RSS、搜索结果摘要 */
export const SITE_DESCRIPTION = site.description;
/** 首页渐变大标题的那句话。留空就显示站名 */
export const SITE_QUOTE = site.quote;
/** 你的笔名，显示在页脚 */
export const AUTHOR = site.author;
/** 页脚社交链接，在后台「站点设置」里增删 */
export const SOCIAL: { href: string; label: string }[] = site.social ?? [];

/**
 * 导航。href 写成不带 base 的站内路径，渲染时会自动加前缀。
 * icon 对应 src/components/Icon.astro 里的图形，手机底栏会用到。
 */
export const NAV = [
	{ href: '/', label: '首页', icon: 'home' },
	{ href: '/works/', label: '作品', icon: 'book' },
	{ href: '/essays/', label: '随笔', icon: 'pen' },
	{ href: '/about/', label: '关于', icon: 'user' },
];
