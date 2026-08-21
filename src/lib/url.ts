/**
 * 给站内路径加上 base 前缀。
 *
 * 部署在子路径下时（本站是 /yuki），Astro 不会自动给模板里写死的
 * href 加前缀，必须手动处理，否则全站链接都会 404。
 * 所有站内链接都要经过这个函数；站外链接不要用。
 *
 *   url('/works/')  →  '/yuki/works/'   （base = '/yuki/'）
 *   url('/works/')  →  '/works/'        （base = '/'）
 */
const BASE = import.meta.env.BASE_URL;

export function url(path = '/'): string {
	const prefix = BASE.replace(/\/+$/, '');
	const rest = String(path).replace(/^\/+/, '');
	return `${prefix}/${rest}`;
}
