import { useEffect, useState } from "react";
import Skeleton from "../../../components/Skeleton/Skeleton";

function AboutHero() {
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Skeleton timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Skeleton UI
  if (showSkeleton) {
    return (
      <section className="about_header_section">
        <div className="about_header">
          <Skeleton width="320px" height="42px" />
          <div style={{ marginTop: "12px" }}>
            <Skeleton width="350px" height="42px" />
          </div>
        </div>

        <div className="about_header_body" style={{ marginTop: "25px" }}>
          <Skeleton width="100%" height="18px" />
          <div style={{ marginTop: "10px" }}>
            <Skeleton width="90%" height="18px" />
          </div>
          <div style={{ marginTop: "10px" }}>
            <Skeleton width="75%" height="18px" />
          </div>
        </div>

        <div className="clock_wrapper">
          <Skeleton width="180px" height="180px" radius="50%" />
        </div>
      </section>
    );
  }

  // Original UI
  return (
    <section className="about_header_section">
      <div className="about_header">
        <h1 className="black_header">
          Designed for Balance,
        </h1>

        <h1 className="blue_header">
          Built for Productivity
        </h1>
      </div>

      <div className="about_header_body">
        <p className="TimeWise">
          TimeWise helps employees manage work hours efficiently
          while preventing burnout and improving transparency
          between employees and management. Track time thoughtfully,
          work smarter and maintain the balance you deserve.
        </p>
      </div>

      <div className="clock_wrapper">
        <div className="clock"></div>
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
      </div>
    </section>
  );
}

export default AboutHero;