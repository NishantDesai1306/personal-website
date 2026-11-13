import type { Job } from '../data/profile';

export interface YearMonth {
  year: number;
  month: number;
}

export interface Range {
  start: number;
  /** Exclusive end year of the ruler. */
  end: number;
}

const toYears = ({ year, month }: YearMonth) => year + (month - 1) / 12;

/** Ruler spanning from the first job's year up to and including `now`'s year. */
export function careerRange(jobs: Job[], now: Date): Range {
  const start = Math.min(...jobs.map((job) => job.start.year));
  return { start, end: now.getFullYear() + 1 };
}

export function rulerYears({ start, end }: Range): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i);
}

/** Horizontal placement of a job on the ruler, as percentages. */
export function placement(job: Job, range: Range, now: Date) {
  const span = range.end - range.start;
  const end = job.end ?? { year: now.getFullYear(), month: now.getMonth() + 1 };
  // A role ending in month M occupies that month, so add one month to the end.
  const from = toYears(job.start) - range.start;
  const to = toYears(end) + 1 / 12 - range.start;
  const left = (from / span) * 100;
  const width = ((to - from) / span) * 100;
  return { left: round(left), width: round(width) };
}

const round = (n: number) => Math.round(n * 100) / 100;
