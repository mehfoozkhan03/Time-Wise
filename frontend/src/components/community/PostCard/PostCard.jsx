import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineChatBubbleLeft,
  HiOutlineShare,
  HiOutlineEllipsisHorizontal,
} from 'react-icons/hi2'

import { toggleLikePost } from '../../../store/postSlice'
import CommentSection from '../CommentSection/CommentSection'

import './PostCard.css'

const PostCard = ({ post }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [showComments, setShowComments] = useState(false)
  const [loading, setLoading] = useState(false)

  const liked = post.isLiked || false

  const likeCount = post.likesCount || 0

  const commentCount = post.commentsCount || 0

  const initials =
    `${post.createdBy?.firstName?.[0] || ''}${post.createdBy?.lastName?.[0] || ''}`.toUpperCase()

  const authorName =
    `${post.createdBy?.firstName || ''} ${post.createdBy?.lastName || ''}`.trim() ||
    'Unknown User'

  const designation = post.createdBy?.designation || 'Employee'

  const createdAt = new Date(post.createdAt).toLocaleString()

  const handleLike = async () => {
    if (loading) return

    try {
      setLoading(true)
      await dispatch(toggleLikePost(post._id))
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-user">
          <div className="post-avatar">{initials || 'U'}</div>

          <div className="post-user-info">
            <h3>{authorName}</h3>
            <p>{designation}</p>
            <small>{createdAt}</small>
          </div>
        </div>

        <button className="post-menu">
          <HiOutlineEllipsisHorizontal />
        </button>
      </div>

      <div className="post-content">
        <p>{post.content}</p>

        {post.image && (
          <img src={post.image} alt="Post" className="post-image" />
        )}
      </div>

      <div className="post-actions">
        <button onClick={handleLike}>
          {liked ? <HiHeart /> : <HiOutlineHeart />}
          Like
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>

        <button onClick={() => setShowComments((prev) => !prev)}>
          <HiOutlineChatBubbleLeft />
          Comment
          {commentCount > 0 && <span>{commentCount}</span>}
        </button>

        <button>
          <HiOutlineShare />
          Share
        </button>
      </div>

      {showComments && <CommentSection postId={post._id} />}
    </article>
  )
}

export default PostCard
