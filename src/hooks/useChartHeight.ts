import { useEffect, useState } from 'react';

/** Responsive chart heights for Recharts ResponsiveContainer. */
export function useChartHeight(
  desktop: number,
  options?: { tablet?: number; mobile?: number }
) {
  const tablet = options?.tablet ?? Math.round(desktop * 0.88);
  const mobile = options?.mobile ?? Math.round(desktop * 0.72);

  const [height, setHeight] = useState(desktop);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setHeight(mobile);
      else if (w < 768) setHeight(tablet);
      else setHeight(desktop);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [desktop, tablet, mobile]);

  return height;
}
