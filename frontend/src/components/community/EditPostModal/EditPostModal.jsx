import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { updateExistingPost } from '../../../store/postSlice'

import './EditPostModal.css'

const EditPostModal = ({ post, onClose }) => {
  const dispatch = useDispatch()

  const [text, setText] = useState(post.content)

  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!text.trim()) return

    try {
      setLoading(true)

      await dispatch(
        updateExistingPost({
          id: post._id,
          postData: {
            content: text,
          },
        }),
      ).unwrap()

      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Edit Post</h2>

        <textarea value={text} onChange={(e) => setText(e.target.value)} />

        <div className="modal-actions">
          <button className='Cancel_button' onClick={onClose}>Cancel</button>

          <button className='save_button'
            onClick={handleSave}
            disabled={loading || !text.trim() || text === post.content}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditPostModal
