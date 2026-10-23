
import { useEffect, useState } from "react";
import { FaAward } from "react-icons/fa";
import Skeleton from "../../../components/Skeleton/Skeleton";

function CTA() {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton) {
    return (
      <section className="transform cta_skeleton">
        {/* Award icon */}
        <Skeleton
          width="24px"
          height="24px"
          radius="4px"
        />

        {/* Heading */}
        <div className="cta_skeleton_heading">
          <Skeleton width="650px" height="28px" />
        </div>

        {/* Description */}
        <div className="cta_skeleton_description">
          <Skeleton width="560px" height="15px" />

          <div className="cta_skeleton_line">
            <Skeleton width="360px" height="15px" />
          </div>
        </div>

        {/* Button */}
        <div className="cta_skeleton_button">
          <Skeleton
            width="190px"
            height="44px"
            radius="12px"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="transform">
      <FaAward className="cta_icon" />

      <h2>
        Ready To Transform Your Team's Productivity
      </h2>

      <p>
        Join thousands of teams using TimeWise to work
        smarter, not harder. Track time thoughtfully and
        maintain the balance you deserve.
      </p>

      <button className="start_today_btn">
        Get Started Today
      </button>
    </section>
  );
}

export default CTA;
