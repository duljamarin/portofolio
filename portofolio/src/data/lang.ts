// Page languages. English is the default; Albanian pages live under /sq/.
export type Lang = 'en' | 'sq';

/** "A, B and C" (or "A, B dhe C") in the page language. */
export function joinList(items: readonly string[], lang: Lang): string {
  if (items.length <= 1) return items.join('');
  const and = lang === 'sq' ? 'dhe' : 'and';
  return `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;
}

/** Albanian names for the countries that appear in the work history. */
export const COUNTRY_SQ: Record<string, string> = {
  Albania: 'Shqipëri',
  Austria: 'Austri',
  Italy: 'Itali',
  Qatar: 'Katar',
  Slovakia: 'Sllovaki',
};

/** No-break space: keeps "Developer ·" together when a title wraps. */
export const NO_BREAK_SPACE = String.fromCharCode(0xa0);
