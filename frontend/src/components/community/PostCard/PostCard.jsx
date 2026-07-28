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

  const liked =
    post.likes?.some(
      (like) =>
        like === user?._id ||
        like?._id === user?._id ||
        like?.user === user?._id,
    ) || false

  const likeCount = post.likes?.length || 0
  const commentCount = post.comments?.length || 0

  const initials =
    `${post.author?.firstName?.[0] || ''}${post.author?.lastName?.[0] || ''}`.toUpperCase()

  const authorName =
    `${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim() ||
    'Unknown User'

  const designation = post.author?.designation || 'Employee'

  const createdAt = new Date(post.createdAt).toLocaleString()

  const handleLike = async () => {
    if (loading) return

    try {
      setLoading(true)
      await toggleLikePost(dispatch, post._id)
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

        <button onClick={() => setShowComments(!showComments)}>
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
