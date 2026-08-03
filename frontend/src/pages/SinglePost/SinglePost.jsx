import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchPost, clearSelectedPost } from "../../store/postSlice";

import PostCard from "../../components/community/PostCard/PostCard";

import "./SinglePost.css";

export const SinglePost = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { selectedPost, loading, isError, errorMessage } = useSelector(
    (state) => state.post,
  );

  useEffect(() => {
    dispatch(fetchPost(id));

    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, id]);

  if (loading) {
    return <div className="single-post-loading">Loading post...</div>;
  }

  if (isError) {
    return <div className="single-post-error">{errorMessage}</div>;
  }

  if (!selectedPost) {
    return <div className="single-post-empty">Post not found.</div>;
  }

  return (
    <div className="single-post-page">
      <button
        className="back-btn"
        onClick={() => navigate("/community")}
      >
        ← Back
      </button>

      <PostCard post={selectedPost} />
    </div>
  );
};
