import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'

import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineChatBubbleLeft,
  HiOutlineShare,
  HiOutlineEllipsisHorizontal,
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineDocument,
  HiOutlineArrowDownTray,
} from 'react-icons/hi2'

import { toggleLikePost, toggleSavePost } from '../../../store/postSlice'

import CommentSection from '../CommentSection/CommentSection'
import PostMenu from '../PostMenu/PostMenu'
import EditPostModal from '../EditPostModal/EditPostModal'
import DeletePostModal from '../DeletePostModal/DeletePostModal'

import './PostCard.css'

import { NavLink } from 'react-router-dom'

const PostCard = ({ post }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [likeLoading, setLikeLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  const [selectedImageIndex, setSelectedImageIndex] = useState(null)

  const menuRef = useRef(null)

  // ======================================================
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // ======================================================

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

  // ======================================================
  // POST DATA
  // ======================================================

  const liked = post.isLiked || false
  const saved = post.isSaved || false

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

  // ======================================================
  // HANDLE LIKE
  // ======================================================

  const handleLike = async () => {
    if (likeLoading) return

    try {
      setLikeLoading(true)

      await dispatch(toggleLikePost(post._id)).unwrap()
    } catch (error) {
      console.error('Like post error:', error)
    } finally {
      setLikeLoading(false)
    }
  }

  // ======================================================
  // HANDLE SAVE
  // ======================================================

  const handleSave = async () => {
    if (saveLoading) return

    try {
      setSaveLoading(true)

      await dispatch(toggleSavePost(post._id)).unwrap()
    } catch (error) {
      console.error('Save post error:', error)
    } finally {
      setSaveLoading(false)
    }
  }

  // ======================================================
  // HANDLE SHARE
  // ======================================================

  const handleShare = async () => {
    try {
      const link = `${window.location.origin}/community/post/${post._id}`

      await navigator.clipboard.writeText(link)

      alert('Link copied to clipboard!')
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  // ======================================================
  // IMAGES
  // Supports new images array + old single image field
  // ======================================================

  const postImages =
    Array.isArray(post.images) && post.images.length > 0
      ? post.images
      : post.image
        ? [
            {
              url: post.image,
              alt: 'Post image',
            },
          ]
        : []

  // ======================================================
  // ATTACHMENTS
  // ======================================================

  const attachments = Array.isArray(post.attachments) ? post.attachments : []

  // ======================================================
  // FORMAT FILE SIZE
  // ======================================================

  const formatFileSize = (bytes) => {
    if (!bytes || bytes <= 0) {
      return '0 Bytes'
    }

    const sizes = ['Bytes', 'KB', 'MB', 'GB']

    const index = Math.floor(Math.log(bytes) / Math.log(1024))

    return `${(bytes / Math.pow(1024, index)).toFixed(
      index === 0 ? 0 : 1,
    )} ${sizes[index]}`
  }

  // ======================================================
  // GET FILE EXTENSION
  // ======================================================

  const getFileExtension = (fileName = '') => {
    const parts = fileName.split('.')

    if (parts.length < 2) {
      return 'FILE'
    }

    return parts.pop().toUpperCase()
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <>
      <article className="post-card">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="post-header">
          <div className="post-user">
            <NavLink
              to={`/community/profile/${post.createdBy?._id}`}
              className="post-avatar-link"
            >
              <div className="post-avatar">{initials || 'U'}</div>
            </NavLink>

            <div className="post-user-info">
              <NavLink to={`/community/profile/${post.createdBy?._id}`}>
                <h3>{authorName}</h3>
              </NavLink>

              <p>{designation}</p>

              <small>
                {createdAt}
                {post.isEdited && ' • Edited'}
              </small>
            </div>
          </div>

          {/* POST MENU */}

          {isOwner && (
            <div ref={menuRef} style={{ position: 'relative' }}>
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

        {/* ==================================================
            POST CONTENT
        ================================================== */}

        <div className="post-content">
          {post.content && <p>{post.content}</p>}

          {/* ================================================
              IMAGES
          ================================================ */}

          {postImages.length > 0 && (
            <div
              className={`post-images post-images-${Math.min(
                postImages.length,
                4,
              )}`}
            >
              {postImages.slice(0, 4).map((image, index) => (
                <button
                  key={image.publicId || image.url || index}
                  type="button"
                  className="post-image-item"
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`Open image ${index + 1}`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Post image ${index + 1}`}
                  />

                  {index === 3 && postImages.length > 4 && (
                    <div className="post-image-more">
                      +{postImages.length - 4}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ================================================
              ATTACHMENTS
          ================================================ */}

          {attachments.length > 0 && (
            <div className="post-attachments">
              {attachments.map((attachment, index) => (
                <a
                  key={attachment.publicId || attachment.url || index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post-attachment"
                >
                  <div className="post-attachment-icon">
                    <HiOutlineDocument />
                  </div>

                  <div className="post-attachment-info">
                    <span className="post-attachment-name">
                      {attachment.originalName || 'Attachment'}
                    </span>

                    <span className="post-attachment-meta">
                      {getFileExtension(attachment.originalName)}

                      {attachment.size
                        ? ` • ${formatFileSize(attachment.size)}`
                        : ''}
                    </span>
                  </div>

                  <HiOutlineArrowDownTray className="post-attachment-download" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ==================================================
            POST ACTIONS
        ================================================== */}

        <div className="post-actions">
          <button onClick={handleLike} disabled={likeLoading}>
            {liked ? <HiHeart /> : <HiOutlineHeart />}
            Like
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          <button onClick={() => setShowComments((prev) => !prev)}>
            <HiOutlineChatBubbleLeft />
            Comment
            {commentCount > 0 && <span>{commentCount}</span>}
          </button>

          <button onClick={handleSave} disabled={saveLoading}>
            {saved ? <HiBookmark /> : <HiOutlineBookmark />}
            Save
          </button>

          <button onClick={handleShare}>
            <HiOutlineShare />
            Share
          </button>
        </div>

        {/* ==================================================
            COMMENTS
        ================================================== */}

        {showComments && <CommentSection postId={post._id} />}
      </article>

      {/* ====================================================
          IMAGE MODAL
      ==================================================== */}

      {selectedImageIndex !== null && (
        <div
          className="post-image-modal"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div
            className="post-image-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="post-image-modal-close"
              onClick={() => setSelectedImageIndex(null)}
              aria-label="Close image"
            >
              ×
            </button>

            <img
              src={postImages[selectedImageIndex]?.url}
              alt={
                postImages[selectedImageIndex]?.alt ||
                `Post image ${selectedImageIndex + 1}`
              }
            />

            {postImages.length > 1 && (
              <div className="post-image-modal-controls">
                <button
                  type="button"
                  disabled={selectedImageIndex === 0}
                  onClick={() =>
                    setSelectedImageIndex((current) => current - 1)
                  }
                >
                  ←
                </button>

                <span>
                  {selectedImageIndex + 1} / {postImages.length}
                </span>

                <button
                  type="button"
                  disabled={selectedImageIndex === postImages.length - 1}
                  onClick={() =>
                    setSelectedImageIndex((current) => current + 1)
                  }
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================
          EDIT MODAL
      ==================================================== */}

      {showEditModal && (
        <EditPostModal post={post} onClose={() => setShowEditModal(false)} />
      )}

      {/* ====================================================
          DELETE MODAL
      ==================================================== */}

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
