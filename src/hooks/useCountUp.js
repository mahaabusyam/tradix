import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// يحرّك الرقم من قيمته الحالية إلى القيمة الجديدة بسلاسة
export default function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0); // آخر قيمة وصلنا إليها (لا تسبب إعادة رسم)
  const reduced = prefersReducedMotion();

  useEffect(() => {
    // بلا حركة: لا شيء نفعله هنا، فالقيمة تُرجع مباشرة في السطر الأخير
    if (reduced) return undefined;

    const from = fromRef.current;
    const startTime = performance.now();
    let frameId;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // يبدأ سريعاً وينتهي ببطء
      const current = from + (target - from) * eased;
      fromRef.current = current;
      setValue(current); // مسموح: داخل callback وليس في جسم الـ effect
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // cleanup: نوقف الحركة إن تغيّر الهدف أو خرج المكون
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, reduced]);

  return reduced ? target : value;
}