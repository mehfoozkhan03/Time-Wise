import { FaEllipsisH } from 'react-icons/fa'
import ProfileAvatar from '../../Common/ProfileAvatar/ProfileAvatar'
import './PostHeader.css'

const PostHeader = ({ post, currentUser, onMenuClick }) => {
  const isOwner = post.createdBy?._id === currentUser?._id

  return (
    <div className="post-header">
      <div className="post-user">
        <ProfileAvatar user={post.createdBy} size={52} className="post-avatar" />

        <div className="post-user-info">
          <h3>
            {post.createdBy?.firstName} {post.createdBy?.lastName}
          </h3>

          <p>{post.createdBy?.designation}</p>

          <small>
            {new Date(post.createdAt).toLocaleString()}
            {post.isEdited && ' • Edited'}
          </small>
        </div>
      </div>

      {isOwner && (
        <button className="post-menu" onClick={onMenuClick}>
          <FaEllipsisH />
        </button>
      )}
    </div>
  )
}

export default PostHeader
