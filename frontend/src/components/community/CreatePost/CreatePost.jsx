import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { createNewPost } from '../../../store/postSlice'

import {
  HiOutlinePhoto,
  HiOutlineFaceSmile,
  HiOutlinePaperClip,
  HiOutlinePaperAirplane,
  HiOutlineXMark,
} from 'react-icons/hi2'

import './CreatePost.css'

const MAX_LENGTH = 500
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

const CreatePost = () => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)

  // ======================================================
  // IMAGE STATE
  // ======================================================

  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const fileInputRef = useRef(null)

  // ======================================================
  // DYNAMIC GREETING
  // ======================================================

  const [greeting, setGreeting] = useState('Good Morning')

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours()

      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning')
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon')
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good Evening')
      } else {
        setGreeting('Good Night')
      }
    }

    updateGreeting()

    const interval = setInterval(updateGreeting, 60000)

    return () => clearInterval(interval)
  }, [])

  // ======================================================
  // USER INITIALS
  // ======================================================

  const initials = useMemo(() => {
    if (!user) return 'U'

    return `${user.firstName?.[0] ?? ''}${
      user.lastName?.[0] ?? ''
    }`.toUpperCase()
  }, [user])

  // ======================================================
  // IMAGE SELECTION
  // ======================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    // Validate image type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      event.target.value = ''
      return
    }

    // Validate image size
    if (file.size > MAX_IMAGE_SIZE) {
      alert('Image size must be less than 5MB.')
      event.target.value = ''
      return
    }

    // Remove previous preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    const previewUrl = URL.createObjectURL(file)

    setSelectedImage(file)
    setImagePreview(previewUrl)

    // Allows selecting the same file again after removing it
    event.target.value = ''
  }

  // ======================================================
  // REMOVE IMAGE
  // ======================================================

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setSelectedImage(null)
    setImagePreview(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  // ======================================================
  // CREATE POST
  // ======================================================

  const handlePost = async () => {
    // Post requires either content or an image
    if ((!content.trim() && !selectedImage) || posting) return

    try {
      setPosting(true)

      const formData = new FormData()

      // Only send content if the user entered something
      if (content.trim()) {
        formData.append('content', content.trim())
      }

      // Field name MUST match upload.single('image')
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      await dispatch(createNewPost(formData)).unwrap()

      // Reset after successful post
      setContent('')
      removeImage()
    } catch (error) {
      console.error('Create post error:', error)

      alert(error || 'Unable to create post.')
    } finally {
      setPosting(false)
    }
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <section className="create_post_card">
      {/* ================================================ */}
      {/* HEADER */}
      {/* ================================================ */}

      <div className="create_post_header">
        <div className="create_post_avatar">{initials}</div>

        <div>
          <h3>
            {greeting}, {user?.firstName || 'Employee'} 👋
          </h3>

          <p>Share an update with your teammates.</p>
        </div>
      </div>

      {/* ================================================ */}
      {/* TEXTAREA */}
      {/* ================================================ */}

      <textarea
        value={content}
        maxLength={MAX_LENGTH}
        placeholder={`What's on your mind, ${user?.firstName || 'there'}?`}
        onChange={(event) => setContent(event.target.value)}
      />

      {/* ================================================ */}
      {/* HIDDEN IMAGE INPUT */}
      {/* ================================================ */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageChange}
      />

      {/* ================================================ */}
      {/* IMAGE PREVIEW */}
      {/* ================================================ */}

      {imagePreview && (
        <div className="post_image_preview">
          <img src={imagePreview} alt="Selected post preview" />

          <button
            type="button"
            className="remove_image_btn"
            onClick={removeImage}
            aria-label="Remove selected image"
          >
            <HiOutlineXMark />
          </button>
        </div>
      )}

      {/* ================================================ */}
      {/* FOOTER */}
      {/* ================================================ */}

      <div className="create_post_footer">
        <div className="create_post_tools">
          {/* IMAGE */}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={posting}
          >
            <HiOutlinePhoto />
            Image
          </button>

          {/* EMOJI - PHASE 3 */}

          <button type="button" disabled={posting}>
            <HiOutlineFaceSmile />
            Emoji
          </button>

          {/* ATTACHMENT - NOT IMPLEMENTED YET */}

          <button type="button" disabled={posting}>
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
            type="button"
            onClick={handlePost}
            disabled={(!content.trim() && !selectedImage) || posting}
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
