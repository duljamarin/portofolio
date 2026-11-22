/// <reference types="vite/client" />

/**
 * Build date as YYYY-MM-DD, defined in vite.config.ts. The client bundle, the
 * server render and the sitemap all read this one value, so the footer year and
 * the years-of-experience label can never differ between server and browser.
 */
declare const __BUILD_DATE__: string;
