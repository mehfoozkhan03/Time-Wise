import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchComments,
  createNewComment,
  deleteExistingComment,
  updateExistingComment,
  toggleLikeComment,
} from '../../../store/postSlice'

import './CommentSection.css'

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const comments = useSelector((state) => state.post.comments[postId] || [])

  const loading = useSelector((state) => state.post.commentLoading)

  // =====================================================
  // Create Comment State
  // =====================================================

  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  // =====================================================
  // Edit Comment State
  // =====================================================

  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editText, setEditText] = useState('')
  const [updating, setUpdating] = useState(false)

  // =====================================================
  // Fetch Comments
  // =====================================================

  useEffect(() => {
    if (!comments.length) {
      dispatch(fetchComments(postId))
    }
  }, [dispatch, postId, comments.length])

  // =====================================================
  // Create Comment
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text.trim() || posting) return

    try {
      setPosting(true)

      await dispatch(
        createNewComment({
          postId,
          text: text.trim(),
        }),
      ).unwrap()

      setText('')
    } catch (error) {
      console.error('Create comment error:', error)
    } finally {
      setPosting(false)
    }
  }

  // =====================================================
  // Delete Comment
  // =====================================================

  const handleDelete = async (commentId) => {
    try {
      await dispatch(
        deleteExistingComment({
          postId,
          commentId,
        }),
      ).unwrap()

      // If the deleted comment was being edited,
      // clear the edit state.
      if (editingCommentId === commentId) {
        setEditingCommentId(null)
        setEditText('')
      }
    } catch (error) {
      console.error('Delete comment error:', error)
    }
  }

  // =====================================================
  // Like Comment
  // =====================================================

  const handleLike = async (commentId) => {
    try {
      await dispatch(
        toggleLikeComment({
          postId,
          commentId,
        }),
      ).unwrap()
    } catch (error) {
      console.error('Like comment error:', error)
    }
  }

  // =====================================================
  // Start Editing
  // =====================================================

  const handleEditStart = (comment) => {
    if (!comment?._id) return

    setEditingCommentId(comment._id)
    setEditText(comment.text || '')
  }

  // =====================================================
  // Cancel Editing
  // =====================================================

  const handleEditCancel = () => {
    if (updating) return

    setEditingCommentId(null)
    setEditText('')
  }

  // =====================================================
  // Save Edited Comment
  // =====================================================

  const handleEditSave = async () => {
    const trimmedText = editText.trim()

    if (!trimmedText) return
    if (updating) return
    if (!editingCommentId) return

    try {
      setUpdating(true)

      const result = await dispatch(
        updateExistingComment({
          postId,
          commentId: editingCommentId,
          text: trimmedText,
        }),
      ).unwrap()

      console.log('Comment updated successfully:', result)

      setEditingCommentId(null)
      setEditText('')
    } catch (error) {
      console.error('Update comment error:', error)
    } finally {
      setUpdating(false)
    }
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="comment-section">
      {/* =================================================
          CREATE COMMENT
      ================================================= */}

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Write a comment..."
          value={text}
          maxLength={500}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="comment-form-footer">
          <span className="comment-count">{text.length}/500</span>

          <button type="submit" disabled={!text.trim() || posting}>
            {posting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </form>

      {/* =================================================
          COMMENTS
      ================================================= */}

      {loading && comments.length === 0 ? (
        <div className="comment-loading">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="comment-loading">
          No comments yet. Be the first to comment.
        </div>
      ) : (
        comments.map((comment) => {
          const author =
            `${comment.createdBy?.firstName ?? ''} ${
              comment.createdBy?.lastName ?? ''
            }`.trim() || 'Unknown User'

          const initials =
            `${comment.createdBy?.firstName?.[0] ?? ''}${
              comment.createdBy?.lastName?.[0] ?? ''
            }`.toUpperCase() || 'U'

          const isOwner = comment.createdBy?._id === user?._id

          const isEditing = editingCommentId === comment._id

          return (
            <div className="comment-card" key={comment._id}>
              {/* =========================================
                  COMMENT HEADER
              ========================================= */}

              <div className="comment-header">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div className="post-avatar">{initials}</div>

                  <div>
                    <strong>{author}</strong>

                    <br />

                    <small>
                      {comment.createdBy?.designation || 'Employee'}
                    </small>
                  </div>
                </div>

                <small>
                  {new Date(comment.createdAt).toLocaleString()}

                  {comment.isEdited && ' • Edited'}
                </small>
              </div>

              {/* =========================================
                  COMMENT CONTENT / EDIT MODE
              ========================================= */}

              {isEditing ? (
                <div className="comment-edit-box">
                  <textarea
                    value={editText}
                    maxLength={500}
                    autoFocus
                    placeholder="Edit your comment..."
                    onChange={(e) => setEditText(e.target.value)}
                  />

                  <div className="comment-edit-actions">
                    <span className="comment-count">{editText.length}/500</span>

                    <div className="comment-edit-buttons">
                      <button
                        type="button"
                        onClick={handleEditSave}
                        disabled={!editText.trim() || updating}
                      >
                        {updating ? 'Saving...' : 'Save'}
                      </button>

                      <button
                        type="button"
                        onClick={handleEditCancel}
                        disabled={updating}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p>{comment.text}</p>
              )}

              {/* =========================================
                  COMMENT ACTIONS
              ========================================= */}

              {!isEditing && (
                <div className="comment-actions">
                  <button type="button" onClick={() => handleLike(comment._id)}>
                    {comment.isLiked ? '❤️' : '🤍'} {comment.likesCount || 0}
                  </button>

                  {isOwner && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEditStart(comment)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(comment._id)}
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

export default CommentSection
