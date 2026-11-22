// Portfolio app types

export type Skill = {
  name: string;
  level: number; // 1-100
  icon?: string;
};

/** One FAQ entry. The visible FAQ and the FAQPage JSON-LD render the same strings. */
export type FaqItem = { q: string; a: string };

/** Identity facts copy needs; passed in from src/seo/site.ts (PERSON). */
export type Identity = { name: string; city: string; countryName: string };
