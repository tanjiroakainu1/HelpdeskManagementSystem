import type { ComponentType } from 'react';

export function buildPageMap(folder: string, pages: Record<string, ComponentType>): Record<string, ComponentType> {
  return Object.fromEntries(
    Object.entries(pages).map(([slug, component]) => [`${folder}/${slug}`, component]),
  );
}
