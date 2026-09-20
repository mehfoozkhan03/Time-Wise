import "./DashboardThought.css";

import { TiPin } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  deleteThoughtbyAdmin,
  fetchPosts,
  togglePinThoughtbyAdmin,
} from "../../../store/postSlice";
import { fetchAllUser } from "../../../store/adminAuthSlice";

export const DashboardThuoght = () => {
  const dispatch = useDispatch();
  const { posts, page, hasMore, isLoading } = useSelector(
    (state) => state.post,
  );

  const formatTimeAgo = (date) => {
    if (!date) return "";

    const diff = Date.now() - new Date(date).getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const thoughtData =
    posts
      ?.map((post) => {
        const user = post.createdBy;

        const firstName = user?.firstName || "";

        const lastName = user?.lastName || "";

        return {
          id: post._id,

          avatar: `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase(),

          name: `${firstName} ${lastName}`.trim() || "Unknown User",

          department: user?.department || "N/A",

          createdAt: post.createdAt,

          content: post.content,

          image: post.image || null,

          isPinned: post.isPinned || false,

          pinnedAt: post.pinnedAt || null,
        };
      })
      .sort((a, b) => {
        // Both are pinned
        if (a.isPinned && b.isPinned) {
          return new Date(b.pinnedAt) - new Date(a.pinnedAt);
        }

        // A pinned, B not pinned
        if (a.isPinned) {
          return -1;
        }

        // B pinned, A not pinned
        if (b.isPinned) {
          return 1;
        }

        // Neither pinned → newest post first
        return new Date(b.createdAt) - new Date(a.createdAt);
      }) || [];

  //# handle more post
  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;

    dispatch(
      fetchPosts({
        page: page + 1,
        limit: 10,
      }),
    );
  };

  //# Pin thought
  const handlePin = (postId) => {
    if (!postId) return;

    dispatch(togglePinThoughtbyAdmin(postId));
  };

  //# Delete thought
  const handleDelete = (postId) => {
    if (!postId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this thought?",
    );

    if (!confirmDelete) return;

    dispatch(deleteThoughtbyAdmin(postId));
  };

  //# thoughts
  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 10 }));
    dispatch(fetchAllUser());
  }, [dispatch]);

  return (
    <>
      <div className="dashboardThoughtManagement-container">
        <div className="dashboardThought-header">
          <h3>Thoughts Management</h3>
          <span>Review, pin and delete employee thoughts</span>
        </div>

        {/* thought management content */}
        <div className="dashboardThoughtManagement-content-container">
          {thoughtData.length > 0 ? (
            thoughtData.map((el) => (
              <div
                className="dashboardThought-content"
                key={el.id}
              >
                <div className="dashboardThought-upper">
                  <div className="thought-user-details">
                    <div className="thought-user-avatar">{el.avatar}</div>
                    <div className="thought-user">
                      <div>
                        <p>{el.name}</p>
                        <span>
                          {el.department} · {formatTimeAgo(el.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="thought-request">
                    <div className="thought-pin">
                      <div
                        onClick={() => handlePin(el.id)}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <TiPin
                          style={{
                            color: el.isPinned ? "#d3365b" : "#717c8f",
                          }}
                        />

                        <span
                          style={{
                            opacity: el.isPinned ? "1" : "0.7",
                          }}
                        >
                          {el.isPinned ? "Unpin" : "Pin"}
                        </span>
                      </div>
                      <div>
                        <MdDelete
                          style={{ color: "#a52b37" }}
                          onClick={() => handleDelete(el.id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dashboardThought-lower">
                  <p>{el.content}</p>
                  {el.image && (
                    <img
                      src={el.image}
                      alt="Thought"
                      className="dashboardThought-image"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No thoughts available.</p>
          )}

          {hasMore && (
            <div className="load-more-wrapper">
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More Posts"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
