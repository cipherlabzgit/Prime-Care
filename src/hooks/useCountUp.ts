import { useEffect, useState } from "react";

function parseStatValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) return { num: 0, suffix: value };
  return {
    num: parseInt(match[1].replace(/,/g, ""), 10),
    suffix: match[2],
  };
}

export function useCountUp(value: string, active: boolean, duration = 1800) {
  const { num, suffix } = parseStatValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!active || num === 0) {
      setDisplay(value);
      return;
    }

    let start: number | null = null;
    let frame: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(num * eased);
      setDisplay(`${current.toLocaleString()}${suffix}`);
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, num, suffix, value, duration]);

  return display;
}
