
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
        {/* Heading and subtitle */}
        <div className="mission_card mission_skeleton_header">
          <Skeleton width="480px" height="36px" />

          <div className="mission_skeleton_subtitle">
            <Skeleton width="390px" height="16px" />
          </div>
        </div>

        {/* Two large cards */}
        <div className="mission_card_hero">
          {[1, 2].map((item) => (
            <div className="mission_box mission_skeleton_box" key={item}>
              {/* Icon placeholder */}
              <Skeleton
                width="60px"
                height="60px"
                radius="16px"
              />

              {/* Title placeholder */}
              <div className="mission_skeleton_title">
                <Skeleton width="290px" height="24px" />
              </div>

              {/* Description placeholders */}
              <div className="mission_skeleton_description">
                <Skeleton width="100%" height="16px" />

                <div className="mission_skeleton_line">
                  <Skeleton width="100%" height="16px" />
                </div>

                <div className="mission_skeleton_line">
                  <Skeleton width="95%" height="16px" />
                </div>

                <div className="mission_skeleton_line">
                  <Skeleton width="70%" height="16px" />
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
