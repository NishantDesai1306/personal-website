import type { APIRoute } from 'astro';
import { profile } from '../data/profile';

export const GET: APIRoute = ({ site }) => {
  const urls = [new URL('/', site).href, new URL(profile.resume, site).href];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
