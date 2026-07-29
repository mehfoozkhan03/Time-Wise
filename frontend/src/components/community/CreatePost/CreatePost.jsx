import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { createNewPost } from '../../../store/postSlice'

import {
  HiOutlinePhoto,
  HiOutlineFaceSmile,
  HiOutlinePaperClip,
  HiOutlinePaperAirplane,
} from 'react-icons/hi2'

import './CreatePost.css'

const MAX_LENGTH = 500

const CreatePost = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)

  const initials = useMemo(() => {
    if (!user) return 'U'

    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
  }, [user])

  const handlePost = async () => {
    if (!content.trim() || posting) return

    try {
      setPosting(true)

      await dispatch(
        createNewPost({
          content: content.trim(),
        }),
      ).unwrap()

      setContent('')
    } catch (error) {
      console.error(error)
      alert(error || 'Unable to create post.')
    } finally {
      setPosting(false)
    }
  }

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

          <button
            className="publish_btn"
            onClick={handlePost}
            disabled={!content.trim() || posting}
          >
            <HiOutlinePaperAirplane />
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default CreatePost
