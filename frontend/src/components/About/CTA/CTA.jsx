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

  return (
    <section className="transform">
      {showSkeleton ? (
        <div className="cta_skeleton_content">
          <Skeleton
            width="28px"
            height="28px"
            radius="6px"
          />

          <div className="cta_skeleton_heading">
            <Skeleton width="min(690px, 90%)" height="30px" />
          </div>

          <div className="cta_skeleton_description">
            <Skeleton width="min(580px, 90%)" height="15px" />

            <div className="cta_skeleton_desc_line">
              <Skeleton width="min(360px, 75%)" height="15px" />
            </div>
          </div>

          <div className="cta_skeleton_button">
            <Skeleton
              width="190px"
              height="44px"
              radius="12px"
            />
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </section>
  );
}

export default CTA;
