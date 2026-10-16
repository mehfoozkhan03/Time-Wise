import { useEffect, useState } from "react";
import { testimonialData } from "../data/testimonialData";
import TestimonialCard from "./TestimonialCard";
import Skeleton from "../../../components/Skeleton/Skeleton";

function Testimonials() {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="what_users_say">
      {showSkeleton ? (
        <>
          <div className="testimonial_skeleton_header">
            <Skeleton width="370px" height="36px" />

            <div className="testimonial_skeleton_subtitle">
              <Skeleton width="380px" height="16px" />
            </div>
          </div>

          <div className="user_say_content">
            {testimonialData.map((review) => (
              <div
                className="testimonial_skeleton_card"
                key={review.id}
              >
                {/* Stars */}
                <div className="testimonial_skeleton_stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton
                      key={star}
                      width="15px"
                      height="15px"
                      radius="3px"
                    />
                  ))}
                </div>

                {/* Review text */}
                <div className="testimonial_skeleton_review">
                  <Skeleton width="100%" height="14px" />

                  <div className="testimonial_skeleton_line">
                    <Skeleton width="65%" height="14px" />
                  </div>
                </div>

                {/* Divider */}
                <div className="testimonial_skeleton_divider" />

                {/* Name and role */}
                <div className="testimonial_skeleton_user">
                  <Skeleton width="145px" height="17px" />

                  <div className="testimonial_skeleton_role">
                    <Skeleton width="110px" height="14px" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1>What Our Users Say</h1>
          <p>Real feedback from teams using TimeWise every day.</p>

          <div className="user_say_content">
            {testimonialData.map((review) => (
              <TestimonialCard
                key={review.id}
                review={review}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Testimonials;
