import { useEffect, useState } from 'react'
import './ProfileAvatar.css'

const ProfileAvatar = ({ user, size = 40, className = '', alt }) => {
  const imageUrl = user?.profileImage || ''
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => setImageFailed(false), [imageUrl])

  const firstName = user?.firstName || ''
  const lastName = user?.lastName || ''
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
    user?.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    'U'
  const sizeInPixels = typeof size === 'number' ? size : undefined

  return (
    <div
      className={`profile-avatar ${className}`.trim()}
      style={{
        '--profile-avatar-size': typeof size === 'number' ? `${size}px` : size,
        fontSize: sizeInPixels ? Math.max(12, sizeInPixels * 0.36) : undefined,
      }}
      role="img"
      aria-label={alt || `${firstName} ${lastName}`.trim() || 'User avatar'}
    >
      {imageUrl && !imageFailed ? (
        <img
          src={imageUrl}
          alt=""
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  )
}

export default ProfileAvatar
