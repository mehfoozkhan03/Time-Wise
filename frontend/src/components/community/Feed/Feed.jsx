import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './Feed.css'

import { fetchPosts } from '../../../store/postSlice'

import PostCard from '../PostCard/PostCard'

const Feed = ({ type = 'feed', sortBy = 'latest' }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const { posts, loading, isError, errorMessage, searchQuery, hasMore, page } =
    useSelector((state) => state.post)

  const [loadingMore, setLoadingMore] = useState(false)

  // =====================================================
  // Initial Fetch
  // =====================================================

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(
        fetchPosts({
          page: 1,
          limit: 10,
          sort: 'newest',
        }),
      )
    }
  }, [dispatch, posts.length])

  // =====================================================
  // Filter + Search + Sort
  // =====================================================

  const filteredPosts = useMemo(() => {
    let result = [...posts]

    // ---------------------------------------------------
    // Feed Type
    // ---------------------------------------------------

    switch (type) {
      case 'my-posts':
        result = result.filter((post) => post.createdBy?._id === user?._id)
        break

      case 'liked':
        result = result.filter((post) => post.isLiked)
        break

      case 'saved':
        result = result.filter((post) => post.isSaved)
        break

      case 'trending':
        result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
        break

      default:
        break
    }

    // ---------------------------------------------------
    // Search
    // ---------------------------------------------------

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()

      result = result.filter((post) => {
        const content = (post.content || '').toLowerCase()

        const author = `${post.createdBy?.firstName || ''} ${
          post.createdBy?.lastName || ''
        }`.toLowerCase()

        return content.includes(query) || author.includes(query)
      })
    }

    // ---------------------------------------------------
    // Sorting
    // ---------------------------------------------------

    switch (sortBy) {
      case 'latest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break

      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break

      case 'likes':
        result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
        break

      case 'comments':
        result.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0))
        break

      default:
        break
    }

    return result
  }, [posts, user, type, searchQuery, sortBy])

  // =====================================================
  // Load More
  // =====================================================

  const handleLoadMore = async () => {
    if (loadingMore || loading || !hasMore) {
      return
    }

    try {
      setLoadingMore(true)

      await dispatch(
        fetchPosts({
          page: page + 1,
          limit: 10,
          sort: 'newest',
        }),
      ).unwrap()
    } catch (error) {
      console.error('Failed to load more posts:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  // =====================================================
  // Initial Loading
  // =====================================================

  if (loading && posts.length === 0) {
    return <div className="feed-loading">Loading posts...</div>
  }

  // =====================================================
  // Error
  // =====================================================

  if (isError && posts.length === 0) {
    return (
      <div className="feed-error">
        {errorMessage || 'Unable to load posts.'}
      </div>
    )
  }

  // =====================================================
  // Empty State
  // =====================================================

  if (filteredPosts.length === 0) {
    return (
      <div className="feed-empty">
        <h2>
          {type === 'saved'
            ? 'No saved posts yet 📌'
            : type === 'liked'
              ? 'No liked posts yet ❤️'
              : type === 'my-posts'
                ? 'No posts yet 📝'
                : type === 'trending'
                  ? 'No trending posts 🔥'
                  : searchQuery.trim()
                    ? 'Nothing found 👀'
                    : 'No posts yet 📝'}
        </h2>

        <p>
          {type === 'saved'
            ? 'Save posts to see them here.'
            : type === 'liked'
              ? 'Like some posts to see them here.'
              : type === 'my-posts'
                ? 'Create your first post.'
                : type === 'trending'
                  ? 'Trending posts will appear here.'
                  : searchQuery.trim()
                    ? 'Try changing your search.'
                    : 'Be the first to share something with the community.'}
        </p>
      </div>
    )
  }

  // =====================================================
  // Feed
  // =====================================================

  return (
    <div className="feed">
      {filteredPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {/* ===============================================
          Load More
      =============================================== */}

      {hasMore && (
        <div className="feed-load-more">
          <button
            type="button"
            className="feed-load-more-btn"
            onClick={handleLoadMore}
            disabled={loadingMore || loading}
          >
            {loadingMore ? 'Loading more...' : 'Load more posts'}
          </button>
        </div>
      )}

      {/* ===============================================
          End of Feed
      =============================================== */}

      {!hasMore && posts.length > 0 && (
        <div className="feed-end">You've reached the end.</div>
      )}
    </div>
  )
}

export default Feed
