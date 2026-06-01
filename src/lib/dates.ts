export function isoNow(): string {
  return new Date().toISOString();
}

export function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 3600000).toISOString();
}

export function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600000).toISOString();
}

export function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86400000).toISOString();
}
