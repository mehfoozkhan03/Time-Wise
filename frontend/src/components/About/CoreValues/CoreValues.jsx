
import { useEffect, useState } from "react";
import { valuesData } from "../data/valuesData";
import ValueCard from "./ValueCard";
import Skeleton from "../../../components/Skeleton/Skeleton";

function CoreValues() {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="core_values">
      {showSkeleton ? (
        <>
          {/* Heading */}
          <div className="core_values_skeleton_header">
            <Skeleton width="310px" height="36px" />

            <div className="core_values_skeleton_subtitle">
              <Skeleton width="520px" height="16px" />
            </div>
          </div>

          {/* Four cards */}
          <div className="core_values_wrapper">
            {valuesData.map((value) => (
              <div
                className="core_value_skeleton_card"
                key={value.id}
              >
                {/* Icon placeholder */}
                <Skeleton
                  width="64px"
                  height="64px"
                  radius="16px"
                />

                {/* Title placeholder */}
                <div className="core_value_skeleton_title">
                  <Skeleton width="170px" height="22px" />

                  <div className="core_value_skeleton_title_line">
                    <Skeleton width="130px" height="22px" />
                  </div>
                </div>

                {/* Description placeholder */}
                <div className="core_value_skeleton_description">
                  <Skeleton width="170px" height="14px" />

                  <div className="core_value_skeleton_description_line">
                    <Skeleton width="110px" height="14px" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1>Our Core Values</h1>

          <p className="meet">
            The principle that guide everything we build and every
            decision we make.
          </p>

          <div className="core_values_wrapper">
            {valuesData.map((value) => (
              <ValueCard key={value.id} value={value} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default CoreValues;
