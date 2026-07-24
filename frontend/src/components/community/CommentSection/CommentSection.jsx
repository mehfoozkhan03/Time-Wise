import { useEffect, useState } from 'react'
import { postService } from '../../../services/postService'

import './CommentSection.css'

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  const loadComments = async () => {
    try {
      setLoading(true)

      const { data } = await postService.getComments(postId)

      setComments(data.comments || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text.trim()) return

    try {
      const { data } = await postService.createComment(postId, text)

      setComments((prev) => [data.comment, ...prev])

      setText('')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await postService.deleteComment(commentId)

      setComments((prev) => prev.filter((comment) => comment._id !== commentId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleLike = async (commentId) => {
    try {
      const { data } = await postService.toggleCommentLike(commentId)

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                isLiked: data.liked,
                likesCount: data.likesCount,
              }
            : comment,
        ),
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="comment-section">
      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button type="submit">Comment</button>
      </form>

      {loading ? (
        <div className="comment-loading">Loading comments...</div>
      ) : (
        comments.map((comment) => (
          <div className="comment-card" key={comment._id}>
            <div className="comment-header">
              <strong>{comment.author?.name}</strong>

              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>

            <p>{comment.text}</p>

            <div className="comment-actions">
              <button onClick={() => handleLike(comment._id)}>
                {comment.isLiked ? '❤️' : '🤍'} {comment.likesCount || 0}
              </button>

              <button onClick={() => handleDelete(comment._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default CommentSection
