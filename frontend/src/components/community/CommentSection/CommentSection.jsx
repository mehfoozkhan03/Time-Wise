import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchComments,
  createNewComment,
  deleteExistingComment,
  toggleLikeComment,
} from '../../../store/postSlice'

import './CommentSection.css'

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const comments = useSelector((state) => state.post.comments[postId] || [])

  const loading = useSelector((state) => state.post.commentLoading)

  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    if (!comments.length) {
      dispatch(fetchComments(postId))
    }
  }, [dispatch, postId, comments.length])

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
      console.error(error)
    } finally {
      setPosting(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await dispatch(
        deleteExistingComment({
          postId,
          commentId,
        }),
      ).unwrap()
    } catch (error) {
      console.error(error)
    }
  }

  const handleLike = async (commentId) => {
    try {
      await dispatch(
        toggleLikeComment({
          postId,
          commentId,
        }),
      ).unwrap()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="comment-section">
      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Write a comment..."
          value={text}
          maxLength={500}
          onChange={(e) => setText(e.target.value)}
        />

        <button type="submit" disabled={!text.trim() || posting}>
          {posting ? 'Posting...' : 'Comment'}
        </button>
      </form>

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

          return (
            <div className="comment-card" key={comment._id}>
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

              <p>{comment.text}</p>

              <div className="comment-actions">
                <button onClick={() => handleLike(comment._id)}>
                  {comment.isLiked ? '❤️' : '🤍'} {comment.likesCount || 0}
                </button>

                {isOwner && (
                  <button onClick={() => handleDelete(comment._id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
export default CommentSection
