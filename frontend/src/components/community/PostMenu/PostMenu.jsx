import { FaEdit, FaTrash } from 'react-icons/fa'

import './PostMenu.css'

const PostMenu = ({ onEdit, onDelete }) => {
  return (
    <div className="post-dropdown">
      <button onClick={onEdit}>
        <FaEdit />

        <span>Edit Post</span>
      </button>

      <button className="delete-btn" onClick={onDelete}>
        <FaTrash />

        <span>Delete Post</span>
      </button>
    </div>
  )
}

export default PostMenu
