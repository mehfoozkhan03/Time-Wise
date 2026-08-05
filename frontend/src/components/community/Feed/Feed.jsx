import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './Feed.css'

import { fetchPosts } from '../../../store/postSlice'

import PostCard from '../PostCard/PostCard'

const Feed = ({ type = 'feed', sortBy = 'latest' }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const { posts, loading, isError, errorMessage, searchQuery } = useSelector(
    (state) => state.post,
  )

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

      case 'saved':
        result = result.filter((post) => post.isSaved)
        break

      case 'trending':
        result = result.sort(
          (a, b) => (b.likesCount || 0) - (a.likesCount || 0),
        )
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

  if (loading && posts.length === 0) {
    return <div className="feed-loading">Loading posts...</div>
  }

  if (isError) {
    return <div className="feed-error">{errorMessage}</div>
  }

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
                  : 'Nothing found 👀'}
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
                  : 'Try changing your search.'}
        </p>
      </div>
    )
  }

  return (
    <div className="feed">
      {filteredPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}

export default Feed
