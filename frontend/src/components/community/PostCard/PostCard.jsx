import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { formatDistanceToNow } from 'date-fns'

import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineChatBubbleLeft,
  HiOutlineShare,
  HiOutlineEllipsisHorizontal,
} from 'react-icons/hi2'

import { toggleLikePost } from '../../../store/postSlice'

import CommentSection from '../CommentSection/CommentSection'
import PostMenu from '../PostMenu/PostMenu'
import EditPostModal from '../EditPostModal/EditPostModal'
import DeletePostModal from '../DeletePostModal/DeletePostModal'

import './PostCard.css'

const PostCard = ({ post }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const liked = post.isLiked || false

  const likeCount = post.likesCount || 0
  const commentCount = post.commentsCount || 0

  const initials = `${post.createdBy?.firstName?.[0] || ''}${
    post.createdBy?.lastName?.[0] || ''
  }`.toUpperCase()

  const authorName =
    `${post.createdBy?.firstName || ''} ${
      post.createdBy?.lastName || ''
    }`.trim() || 'Unknown User'

  const designation = post.createdBy?.designation || 'Employee'

  const createdAt = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  })

  const isOwner = post.createdBy?._id === user?._id

  const handleLike = async () => {
    if (loading) return

    try {
      setLoading(true)

      await dispatch(toggleLikePost(post._id)).unwrap()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      const link = `${window.location.origin}/community/post/${post._id}`

      await navigator.clipboard.writeText(link)

      alert('Link copied to clipboard!')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <article className="post-card">
        {/* Header */}

        <div className="post-header">
          <div className="post-user">
            <div className="post-avatar">{initials || 'U'}</div>

            <div className="post-user-info">
              <h3>{authorName}</h3>

              <p>{designation}</p>

              <small>
                {createdAt}

                {post.isEdited && ' • Edited'}
              </small>
            </div>
          </div>

          {isOwner && (
            <div
              ref={menuRef}
              style={{
                position: 'relative',
              }}
            >
              <button
                className="post-menu"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <HiOutlineEllipsisHorizontal />
              </button>

              {showMenu && (
                <PostMenu
                  onEdit={() => {
                    setShowEditModal(true)
                    setShowMenu(false)
                  }}
                  onDelete={() => {
                    setShowDeleteModal(true)
                    setShowMenu(false)
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Content */}

        <div className="post-content">
          <p>{post.content}</p>

          {post.image && (
            <img src={post.image} alt="Post" className="post-image" />
          )}
        </div>

        {/* Actions */}

        <div className="post-actions">
          <button onClick={handleLike} disabled={loading}>
            {liked ? <HiHeart /> : <HiOutlineHeart />}
            Like
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          <button onClick={() => setShowComments((prev) => !prev)}>
            <HiOutlineChatBubbleLeft />
            Comment
            {commentCount > 0 && <span>{commentCount}</span>}
          </button>

          <button onClick={handleShare}>
            <HiOutlineShare />
            Share
          </button>
        </div>

        {/* Comments */}

        {showComments && <CommentSection postId={post._id} />}
      </article>

      {/* Edit Modal */}

      {showEditModal && (
        <EditPostModal post={post} onClose={() => setShowEditModal(false)} />
      )}

      {/* Delete Modal */}

      {showDeleteModal && (
        <DeletePostModal
          postId={post._id}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  )
}

export default PostCard
