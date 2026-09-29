import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";


import { FaHeart, FaComment, FaBookmark, FaArrowRight } from "react-icons/fa";


import Skeleton from "../../../components/Skeleton/Skeleton";
import Card from "../../Card/Card";
import "./FeaturedThought.css";
import { Star } from "../../Star/star";
import { fetchFeaturedThought } from "../../../store/postSlice";



export default function FeaturedThought() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { featured, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchFeaturedThought());
  }, [dispatch]);

  const [showSkeleton, setShowSkeleton] = useState(true);

  // ===================== Skeleton =========================

  if (loading) {
    // ======================== Skeleton =========================

    if (showSkeleton) {
      return (
        <section className="featured_thought_section">
          <Skeleton
            width="180px"
            height="30px"
          />

          <Card className="featured_thought_card">
            <div style={{ marginBottom: "20px" }}>
              <Skeleton
                width="150px"
                height="28px"
                radius="20px"
              />
            </div>

            {/* AUTHOR */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <Skeleton
                width="55px"
                height="55px"
                radius="50%"
              />

              <div>
                <Skeleton
                  width="150px"
                  height="18px"
                />

                <div style={{ marginTop: "8px" }}>
                  <Skeleton
                    width="100px"
                    height="14px"
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <Skeleton
                width="100%"
                height="16px"
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <Skeleton
                width="90%"
                height="16px"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <Skeleton
                width="70%"
                height="16px"
              />
            </div>

            {/* ACTIONS */}

            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              <Skeleton
                width="40px"
                height="20px"
              />

              <Skeleton
                width="40px"
                height="20px"
              />

              <Skeleton
                width="40px"
                height="20px"
              />
            </div>

            <Skeleton
              width="170px"
              height="45px"
              radius="10px"
            />
          </Card>
        </section>
      );
    }
  }

  /* ========================== BACKEND LOADING SKELETON ======================== */

  //# Decide which thought to show 
  const thoughtToShow = featured;

  // ======================== No Thought ============================

  if (!thoughtToShow) {
    return (
      <section className="featured_thought_section">
        <h2>Featured Thought</h2>

        <Card className="featured_thought_card">
          <p>No featured thought available.</p>
        </Card>
      </section>
    );
  }

  // ==========================================
  // Author
  // ==========================================

  const author = thoughtToShow.createdBy;

  const initials = `${author?.firstName?.[0] ?? ""}${
    author?.lastName?.[0] ?? ""
  }`;

  // ===================== Render ==========================

  return (
    <section
      className="featured_thought_section"
      id="tour-thought-card"
    >
      <h2>Featured Thought</h2>

      <Card className="featured_thought_card">
        {/* Badge */}

        <div className="featured_badge">
          <Star />

          <span>
            {thoughtToShow?.isPinned ? "Pinned Thought" : "Thought of the Day"}
          </span>
        </div>

        {/* Author */}

        <div className="thought_author">
          <div className="author_avatar">{initials}</div>

          <div className="author_info">
            <h3>
              {author?.firstName} {author?.lastName}
            </h3>

            <span>{author?.designation || "Employee"}</span>
          </div>
        </div>

        {/* Content */}

        <blockquote>"{thoughtToShow?.content}"</blockquote>

        {/* Actions */}

        <div
          className="thought_actions"
          id="tour-thought-actions"
        >
          <div className="action_item">
            <FaHeart />

            <span>{thoughtToShow?.likesCount || 0}</span>
          </div>

          <div className="action_item">
            <FaComment />

            <span>{thoughtToShow?.commentsCount || 0}</span>
          </div>

          <div className="action_item">
            <FaBookmark />
          </div>
        </div>

        {/* Community Button */}

        <button
          className="community_button"
          onClick={() => navigate("/community")}
        >
          <span>View Community</span>

          <FaArrowRight />
        </button>
      </Card>
    </section>
  );
}
