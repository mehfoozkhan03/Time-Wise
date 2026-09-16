import { useEffect, useState } from "react";

export default function useCountUp(endValue, duration = 2000) {
  const target =
    typeof endValue === "number" ? endValue : parseFloat(endValue) || 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isNaN(target) || target === 0) {
      setCount(0);
      return;
    }

    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}
