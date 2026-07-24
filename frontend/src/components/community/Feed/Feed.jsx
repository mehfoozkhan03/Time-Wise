import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './Feed.css'

import { fetchPosts } from '../../../store/postSlice'

import PostCard from '../PostCard/PostCard'

const Feed = () => {
  const dispatch = useDispatch()

  const { posts, loading, page, hasMore, isError, errorMessage } = useSelector(
    (state) => state.post,
  )

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts())
    }
  }, [dispatch, posts.length])

  if (loading && posts.length === 0) {
    return <div className="feed-loading">Loading posts...</div>
  }

  if (isError) {
    return <div className="feed-error">{errorMessage}</div>
  }

  if (posts.length === 0) {
    return <div className="feed-empty">No posts yet.</div>
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {loading && <div className="feed-loading-more">Loading...</div>}

      {!hasMore && posts.length > 0 && (
        <div className="feed-end">You've reached the end.</div>
      )}
    </div>
  )
}

export default Feed
