import { useEffect, useState } from 'react';

/** Lifts chat panel above mobile keyboard using Visual Viewport API. */
export function useChatViewport(active: boolean): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!active || typeof window === 'undefined' || !window.visualViewport) {
      setOffset(0);
      return;
    }

    const vv = window.visualViewport;

    const update = () => {
      const gap = window.innerHeight - vv.height - vv.offsetTop;
      setOffset(gap > 0 ? Math.round(gap) : 0);
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      setOffset(0);
    };
  }, [active]);

  return offset;
}
