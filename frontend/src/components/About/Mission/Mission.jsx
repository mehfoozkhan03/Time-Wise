import { useEffect, useState } from "react";
import Skeleton from "../../../components/Skeleton/Skeleton";

function Mission() {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton) {
    return (
      <section className="mission_section">
        {/* Centered heading */}
        <div className="mission_card mission_skeleton_header">
          <Skeleton width="min(480px, 90%)" height="36px" />

          <div className="mission_skeleton_subtitle">
            <Skeleton width="min(390px, 85%)" height="16px" />
          </div>
        </div>

        {/* Two large mission cards */}
        <div className="mission_card_hero">
          {[1, 2].map((item) => (
            <div className="mission_box mission_skeleton_box" key={item}>
              {/* Icon */}
              <Skeleton
                width="60px"
                height="60px"
                radius="16px"
              />

              {/* Card title */}
              <div className="mission_skeleton_title">
                <Skeleton
                  width={item === 1 ? "290px" : "350px"}
                  height="25px"
                />
              </div>

              {/* Description */}
              <div className="mission_skeleton_description">
                <Skeleton width="100%" height="16px" />

                <div className="mission_skeleton_line">
                  <Skeleton width="96%" height="16px" />
                </div>

                <div className="mission_skeleton_line">
                  <Skeleton width="90%" height="16px" />
                </div>

                <div className="mission_skeleton_line">
                  <Skeleton width="65%" height="16px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mission_section">
      <div className="mission_card">
        <h1>Our Mission &amp; Philosophy</h1>

        <p>
          TimeWise was created to solve a fundamental problem.
        </p>
      </div>

      <div className="mission_card_hero">
        <div className="mission_box">
          <div className="bullseye">🎯</div>

          <h2>Why We Built TimeWise</h2>

          <p>
            Traditional time trackers focus on surveillance.
            We focus on empowerment. TimeWise gives teams
            the insights they need to work smarter—not
            longer—while respecting individual autonomy
            and promoting sustainable work habits.
          </p>
        </div>

        <div className="mission_box">
          <div className="star_div">☆</div>

          <h2>Transparency &amp; Health Rhythms</h2>

          <p>
            We believe in full transparency—both in how
            the tool works and how your data is used.
            TimeWise helps establish healthy work
            rhythms by providing clear visibility into
            patterns without judgment or micromanagement.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Mission;
