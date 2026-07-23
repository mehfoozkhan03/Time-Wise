import { useEffect, useState } from "react";

export default function useCountUp(endValue, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = endValue / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [endValue, duration]);

  return count;
}