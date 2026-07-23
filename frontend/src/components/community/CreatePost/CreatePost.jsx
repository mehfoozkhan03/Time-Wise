import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  HiOutlinePhoto,
  HiOutlineFaceSmile,
  HiOutlinePaperClip,
  HiOutlinePaperAirplane,
} from 'react-icons/hi2'

import './CreatePost.css'

const MAX_LENGTH = 500

const CreatePost = () => {
  const { user } = useSelector((state) => state.auth)

  const [content, setContent] = useState('')

  const initials = useMemo(() => {
    if (!user) return 'U'

    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
  }, [user])

  return (
    <section className="create_post_card">
      <div className="create_post_header">
        <div className="create_post_avatar">{initials}</div>

        <div>
          <h3>Good Morning, {user?.firstName || 'Employee'} 👋</h3>

          <p>Share an update with your teammates.</p>
        </div>
      </div>

      <textarea
        value={content}
        maxLength={MAX_LENGTH}
        placeholder={`What's on your mind, ${user?.firstName || 'there'}?`}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="create_post_footer">
        <div className="create_post_tools">
          <button>
            <HiOutlinePhoto />
            Image
          </button>

          <button>
            <HiOutlineFaceSmile />
            Emoji
          </button>

          <button>
            <HiOutlinePaperClip />
            Attachment
          </button>
        </div>

        <div className="create_post_actions">
          <span>
            {content.length}/{MAX_LENGTH}
          </span>

          <button className="publish_btn">
            <HiOutlinePaperAirplane />
            Post
          </button>
        </div>
      </div>
    </section>
  )
}

export default CreatePost
