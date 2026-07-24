import { useState } from 'react'
import { useDispatch } from 'react-redux'

import './PostCard.css'

import { toggleLikePost } from '../../../store/postSlice'

import CommentSection from '../CommentSection/CommentSection'

const PostCard = ({ post }) => {
  const dispatch = useDispatch()

  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    dispatch(toggleLikePost(post._id))
  }

  const formatDate = (date) => {
    const value = new Date(date)

    return value.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  return (
    <article className="post-card fade_in">
      <div className="post-header">
        <div className="post-user">
          <div className="post-avatar">
            {post.author?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h4>{post.author?.name}</h4>

            <small>
              {post.author?.designation}

              {post.author?.department && ` • ${post.author.department}`}
            </small>

            <small>{formatDate(post.createdAt)}</small>
          </div>
        </div>
      </div>

      <div className="post-body">
        {post.title && <h3>{post.title}</h3>}

        <p>{post.content}</p>

        {post.image && <img src={post.image} alt="" className="post-image" />}
      </div>

      <div className="post-footer">
        <button onClick={handleLike}>
          {post.isLiked ? '❤️' : '🤍'}

          {post.likesCount || 0}
        </button>

        <button onClick={() => setShowComments(!showComments)}>
          💬 {post.commentsCount || 0}
        </button>

        <button>↗ Share</button>
      </div>

      {showComments && <CommentSection postId={post._id} />}
    </article>
  )
}

export default PostCard
