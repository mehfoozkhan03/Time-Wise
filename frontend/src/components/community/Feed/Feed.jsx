import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './Feed.css'

import { fetchPosts } from '../../../store/postSlice'

import PostCard from '../PostCard/PostCard'

const Feed = ({ type = 'feed' }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const { posts, loading, hasMore, isError, errorMessage, searchQuery } =
    useSelector((state) => state.post)

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts())
    }
  }, [dispatch, posts.length])

  const filteredPosts = useMemo(() => {
    let result = [...posts]

    switch (type) {
      case 'my-posts':
        result = result.filter((post) => post.createdBy?._id === user?._id)
        break

      case 'liked':
        result = result.filter((post) => post.isLiked)
        break

      case 'trending':
        result = result.sort(
          (a, b) => (b.likesCount || 0) - (a.likesCount || 0),
        )
        break

      case 'saved':
        result = result.filter((post) => post.isSaved)
        break

      default:
        break
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()

      result = result.filter((post) => {
        const content = (post.content || '').toLowerCase()

        const author = `${post.createdBy?.firstName || ''} ${
          post.createdBy?.lastName || ''
        }`.toLowerCase()

        return content.includes(query) || author.includes(query)
      })
    }

    return result
  }, [posts, user, type, searchQuery])

  if (loading && posts.length === 0) {
    return <div className="feed-loading">Loading posts...</div>
  }

  if (isError) {
    return <div className="feed-error">{errorMessage}</div>
  }

  if (filteredPosts.length === 0) {
    return <div className="feed-empty">No posts found.</div>
  }

  return (
    <div className="feed">
      {filteredPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {loading && <div className="feed-loading-more">Loading...</div>}

      {!hasMore && filteredPosts.length > 0 && (
        <div className="feed-end">You've reached the end.</div>
      )}
    </div>
  )
}

export default Feed
