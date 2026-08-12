import { useEffect, useRef, useState } from "react";
import "./CommunityProfilePost.css";

import {
  HiOutlineHeart,
  HiOutlineChatBubbleLeft,
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineShare,
  HiOutlineEllipsisHorizontal,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const CommunityProfilePosts = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Posts");

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filterOptions = [
    "All Posts",
    "Most Recent",
    "Most Liked",
    "Most Discussed",
  ];

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setShowDropdown(false);
  };

  // All POSTS
  const { userId } = useParams();

  const { posts } = useSelector((state) => state.post);

  const profilePosts =
    posts?.filter((post) => String(post.createdBy?._id) === String(userId)) ||
    [];

  return (
    <section className="community-posts">
      {/* ================= HEADER ================= */}

      <div className="community-posts-header">
        <div className="community-posts-title">
          <h3>Posts</h3>
          <span>({profilePosts.length})</span>
        </div>

        {/* ================= DROPDOWN ================= */}

        <div
          className="community-posts-filter-wrapper"
          ref={dropdownRef}
        >
          <button
            className={`community-posts-filter ${
              showDropdown ? "community-posts-filter-active" : ""
            }`}
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <span>{selectedFilter}</span>

            <HiOutlineChevronDown
              className={
                showDropdown
                  ? "community-posts-chevron community-posts-chevron-open"
                  : "community-posts-chevron"
              }
            />
          </button>

          {showDropdown && (
            <div className="community-posts-dropdown">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  className={`community-posts-dropdown-item ${selectedFilter === option ? "community-posts-dropdown-item-selected" : ""}`}
                  onClick={() => handleFilterChange(option)}
                >
                  {selectedFilter === option && (
                    <span className="community-posts-check">✓</span>
                  )}

                  <span>{option}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* </div> */}

      {/* ================= POSTS ================= */}

      <div className="community-posts-list">
        {profilePosts.length > 0 ? (
          profilePosts.map((post) => (
            <article
              className="community-post"
              key={post._id}
            >
              {/* ================= POST HEADER ================= */}

              <div className="community-post-header">
                <div className="community-post-author">
                  <div className="community-post-avatar">
                    {post.createdBy?.profileImage ? (
                      <img
                        src={post.createdBy.profileImage}
                        alt={`${post.createdBy.firstName} ${post.createdBy.lastName}`}
                      />
                    ) : (
                      `${post.createdBy?.firstName?.[0] || ""}${
                        post.createdBy?.lastName?.[0] || ""
                      }`.toUpperCase()
                    )}
                  </div>

                  <div className="community-post-author-info">
                    <h3>
                      {post.createdBy?.firstName} {post.createdBy?.lastName}
                    </h3>

                    <div className="community-post-meta">
                      <span>{post.createdBy?.designation || "Employee"}</span>

                      <span className="community-post-dot">•</span>

                      <span>{post.timeAgo || "Recently"}</span>

                      {post.isEdited && (
                        <>
                          <span className="community-post-dot">•</span>

                          <span className="community-post-edited">Edited</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button className="community-post-more">
                  <HiOutlineEllipsisHorizontal />
                </button>
              </div>

              {/* ================= POST CONTENT ================= */}

              <div className="community-post-content">
                <p>{post.content}</p>

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="community-post-image"
                  />
                )}

                {/* Tags */}

                {post.tags?.length > 0 && (
                  <div className="community-post-tags">
                    {post.tags.map((tag, index) => (
                      <span key={index}>#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* ================= POST ACTIONS ================= */}

              <div className="community-post-actions">
                <div className="community-post-left-actions">
                  <button>
                    <HiOutlineHeart />

                    <span>{post.likesCount || 0}</span>
                  </button>

                  <button>
                    <HiOutlineChatBubbleLeft />

                    <span>{post.commentsCount || 0}</span>
                  </button>

                  <button>
                    {post.isSaved ? <HiBookmark /> : <HiOutlineBookmark />}

                    <span>Save</span>
                  </button>
                </div>

                <button className="community-post-share">
                  <HiOutlineShare />

                  <span>Share</span>
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="community-posts-empty">
            <h3>No posts yet</h3>
            <p>This user hasn't shared anything with the community yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};
