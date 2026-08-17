import "./CommunityProfilePost.css";

import {
  HiOutlineHeart,
  HiOutlineChatBubbleLeft,
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineShare,
  HiOutlineEllipsisHorizontal,
} from "react-icons/hi2";


export const CommunityProfilePosts = ({ posts = [] }) => {
  return (
    <section className="community-posts">

      {/* ================= HEADER ================= */}

      <div className="community-posts__header">

        <div className="community-posts__title">
          <h2>Posts</h2>
          <span>({posts.length})</span>
        </div>

        <button className="community-posts__filter">
          <span>All Posts</span>

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

      </div>


      {/* ================= POSTS ================= */}

      <div className="community-posts__list">

        {posts.length > 0 ? (

          posts.map((post) => (

            <article
              className="community-post"
              key={post._id}
            >

              {/* ================= POST HEADER ================= */}

              <div className="community-post__header">

                <div className="community-post__author">

                  <div className="community-post__avatar">

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


                  <div className="community-post__author-info">

                    <h3>
                      {post.createdBy?.firstName}{" "}
                      {post.createdBy?.lastName}
                    </h3>

                    <div className="community-post__meta">

                      <span>
                        {post.createdBy?.designation || "Employee"}
                      </span>

                      <span className="community-post__dot">
                        •
                      </span>

                      <span>
                        {post.timeAgo || "Recently"}
                      </span>

                      {post.isEdited && (
                        <>
                          <span className="community-post__dot">
                            •
                          </span>

                          <span className="community-post__edited">
                            Edited
                          </span>
                        </>
                      )}

                    </div>

                  </div>

                </div>


                <button className="community-post__more">
                  <HiOutlineEllipsisHorizontal />
                </button>

              </div>


              {/* ================= POST CONTENT ================= */}

              <div className="community-post__content">

                <p>
                  {post.content}
                </p>


                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="community-post__image"
                  />
                )}


                {/* Tags */}

                {post.tags?.length > 0 && (
                  <div className="community-post__tags">

                    {post.tags.map((tag, index) => (
                      <span key={index}>
                        #{tag}
                      </span>
                    ))}

                  </div>
                )}

              </div>


              {/* ================= POST ACTIONS ================= */}

              <div className="community-post__actions">

                <div className="community-post__left-actions">

                  <button>
                    <HiOutlineHeart />

                    <span>
                      {post.likesCount || 0}
                    </span>
                  </button>


                  <button>
                    <HiOutlineChatBubbleLeft />

                    <span>
                      {post.commentsCount || 0}
                    </span>
                  </button>


                  <button>

                    {post.isSaved ? (
                      <HiBookmark />
                    ) : (
                      <HiOutlineBookmark />
                    )}

                    <span>
                      Save
                    </span>

                  </button>

                </div>


                <button className="community-post__share">

                  <HiOutlineShare />

                  <span>
                    Share
                  </span>

                </button>

              </div>

            </article>

          ))

        ) : (

          <div className="community-posts__empty">
            <h3>No posts yet</h3>
            <p>
              This user hasn't shared anything with the community yet.
            </p>
          </div>

        )}

      </div>

    </section>
  );
};