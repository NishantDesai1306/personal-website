import type { APIRoute } from 'astro';
import { caseStudies, jobs, profile, projects, skillGroups, vitals } from '../data/profile';

// Plain-text profile for AI agents and LLM crawlers (https://llmstxt.org).
// Generated from the same data as the page so the two never drift apart.
export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const point = (p: (typeof jobs)[number]['points'][number]) =>
    typeof p === 'string' ? `- ${p}` : [`- ${p.main}`, ...p.subPoints.map((s) => `  - ${s}`)].join('\n');

  const body = [
    `# ${profile.name}`,
    '',
    `> ${profile.tagline}. ${profile.intro}`,
    '',
    `- Website: ${profile.site}`,
    `- Email: ${profile.email}`,
    `- Résumé (PDF): ${url(profile.resume)}`,
    `- GitHub: ${profile.links.github}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    `- Upwork: ${profile.links.upwork}`,
    '',
    '## About',
    '',
    ...profile.about.flatMap((p) => [p, '']),
    '## Skills',
    '',
    ...skillGroups.map((g) => `- ${g.name}: ${g.items.join(', ')}`),
    '',
    '## Case studies',
    '',
    ...caseStudies.flatMap((study) => [
      `### ${study.title} (${study.company})`,
      '',
      study.summary,
      '',
      ...study.sections.map((s) => `- ${s.heading}: ${s.body}`),
      '',
    ]),
    '## Core Web Vitals results at J.D. Power',
    '',
    ...vitals.map((v) => `- ${v.viewport}: "Good" URLs +${v.good}%, "Poor" URLs -${v.poor}%`),
    '',
    '## Experience',
    '',
    ...jobs.flatMap((job) => [
      `### ${job.title} — ${job.company} (${job.duration})`,
      '',
      `Company: ${job.url}`,
      '',
      ...job.points.map(point),
      '',
    ]),
    '## Projects',
    '',
    ...projects.flatMap((project) => [
      `### ${project.name}`,
      '',
      project.summary,
      '',
      `Stack: ${project.stack.join(', ')}`,
      ...project.links.map((l) => `- ${l.label}: ${l.href}`),
      ...(project.parts ?? []).map((part) => `- ${part.name}: ${part.description}`),
      '',
    ]),
    '## Contact',
    '',
    profile.contact,
    '',
    `Email ${profile.email}.`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
