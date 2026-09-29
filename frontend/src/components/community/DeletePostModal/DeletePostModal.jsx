import { useDispatch } from 'react-redux'

import { deleteExistingPost } from '../../../store/postSlice'

import './DeletePostModal.css'
import { Modal } from '../../Modal/Modal'

const DeletePostModal = ({ postId, onClose }) => {
  const dispatch = useDispatch()

  const handleDelete = async () => {
    try {
      await dispatch(deleteExistingPost(postId)).unwrap()

      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal isOpen overlayClassName="modal-overlay" className="delete-modal">
        <h2>Delete Post?</h2>

        <p>This action cannot be undone.</p>

        <div className="modal-actions">
          <button className='Cancel_button' onClick={onClose}>Cancel</button>

          <button className="danger-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
    </Modal>
  )
}

export default DeletePostModal
