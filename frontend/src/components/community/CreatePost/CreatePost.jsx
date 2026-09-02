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

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_IMAGES = 4

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024
const MAX_ATTACHMENTS = 5

const CreatePost = () => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)

  // ======================================================
  // IMAGE STATE
  // ======================================================

  const [selectedImages, setSelectedImages] = useState([])

  const fileInputRef = useRef(null)

  // ======================================================
  // ATTACHMENT STATE
  // ======================================================

  const [selectedAttachments, setSelectedAttachments] = useState([])

  const attachmentInputRef = useRef(null)

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
    const files = Array.from(event.target.files || [])

    if (!files.length) return

    const remainingSlots = MAX_IMAGES - selectedImages.length

    if (remainingSlots <= 0) {
      alert(`You can upload a maximum of ${MAX_IMAGES} images.`)
      event.target.value = ''
      return
    }

    const filesToProcess = files.slice(0, remainingSlots)

    const validImages = []

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image.`)
        continue
      }

      if (file.size > MAX_IMAGE_SIZE) {
        alert(`${file.name} is larger than 5MB.`)
        continue
      }

      validImages.push({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      })
    }

    if (validImages.length > 0) {
      setSelectedImages((previousImages) => [...previousImages, ...validImages])
    }

    if (files.length > remainingSlots) {
      alert(`Only ${remainingSlots} more image(s) can be added.`)
    }

    // Allows selecting the same image again
    event.target.value = ''
  }

  // ======================================================
  // REMOVE SINGLE IMAGE
  // ======================================================

  const removeImage = (id) => {
    setSelectedImages((previousImages) => {
      const imageToRemove = previousImages.find((image) => image.id === id)

      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview)
      }

      return previousImages.filter((image) => image.id !== id)
    })
  }

  // ======================================================
  // ATTACHMENT SELECTION
  // ======================================================

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files || [])

    if (!files.length) return

    const remainingSlots = MAX_ATTACHMENTS - selectedAttachments.length

    if (remainingSlots <= 0) {
      alert(`You can upload a maximum of ${MAX_ATTACHMENTS} attachments.`)

      event.target.value = ''
      return
    }

    const allowedTypes = [
      'application/pdf',

      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',

      'text/plain',
    ]

    const validFiles = []

    for (const file of files.slice(0, remainingSlots)) {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type.`)
        continue
      }

      if (file.size > MAX_ATTACHMENT_SIZE) {
        alert(`${file.name} is larger than 10MB.`)
        continue
      }

      validFiles.push({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
      })
    }

    if (validFiles.length > 0) {
      setSelectedAttachments((previous) => [...previous, ...validFiles])
    }

    if (files.length > remainingSlots) {
      alert(`Only ${remainingSlots} more attachment(s) can be added.`)
    }

    // Allows selecting the same file again
    event.target.value = ''
  }

  // ======================================================
  // REMOVE ATTACHMENT
  // ======================================================

  const removeAttachment = (id) => {
    setSelectedAttachments((previous) =>
      previous.filter((attachment) => attachment.id !== id),
    )
  }

  // ======================================================
  // CLEANUP IMAGE PREVIEW URLS
  // ======================================================

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview)
        }
      })
    }
  }, [])

  // ======================================================
  // CREATE POST
  // ======================================================

  const handlePost = async () => {
    const isEmpty =
      !content.trim() &&
      selectedImages.length === 0 &&
      selectedAttachments.length === 0

    if (isEmpty || posting) {
      return
    }

    try {
      setPosting(true)

      const formData = new FormData()

      // ================= Content =================

      if (content.trim()) {
        formData.append('content', content.trim())
      }

      // ================= Images =================

      selectedImages.forEach((image) => {
        formData.append('images', image.file)
      })

      // ================= Attachments =================

      selectedAttachments.forEach((attachment) => {
        formData.append('attachments', attachment.file)
      })

      // ================= Create Post =================

      await dispatch(createNewPost(formData)).unwrap()

      // ================= Cleanup Image URLs =================

      selectedImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview)
        }
      })

      // ================= Reset =================

      setContent('')
      setSelectedImages([])
      setSelectedAttachments([])
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
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="create_post_header">
        <div className="create_post_avatar">{initials}</div>

        <div>
          <h3>
            {greeting}, {user?.firstName || 'Employee'} 👋
          </h3>

          <p>Share an update with your teammates.</p>
        </div>
      </div>

      {/* ================================================= */}
      {/* TEXTAREA */}
      {/* ================================================= */}

      <textarea
        value={content}
        maxLength={MAX_LENGTH}
        placeholder={`What's on your mind, ${user?.firstName || 'there'}?`}
        onChange={(event) => setContent(event.target.value)}
      />

      {/* ================================================= */}
      {/* HIDDEN IMAGE INPUT */}
      {/* ================================================= */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleImageChange}
      />

      {/* ================================================= */}
      {/* HIDDEN ATTACHMENT INPUT */}
      {/* ================================================= */}

      <input
        ref={attachmentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        multiple
        hidden
        onChange={handleAttachmentChange}
      />

      {/* ================================================= */}
      {/* IMAGE PREVIEWS */}
      {/* ================================================= */}

      {selectedImages.length > 0 && (
        <div
          className={`post_image_preview_grid image_count_${selectedImages.length}`}
        >
          {selectedImages.map((image) => (
            <div className="post_image_preview" key={image.id}>
              <img src={image.preview} alt="Selected post preview" />

              <button
                type="button"
                className="remove_image_btn"
                onClick={() => removeImage(image.id)}
                aria-label="Remove selected image"
              >
                <HiOutlineXMark />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================================================= */}
      {/* ATTACHMENT PREVIEWS */}
      {/* ================================================= */}

      {selectedAttachments.length > 0 && (
        <div className="post_attachment_preview">
          {selectedAttachments.map((attachment) => (
            <div className="post_attachment_item" key={attachment.id}>
              <div className="post_attachment_info">
                <HiOutlinePaperClip />

                <span>{attachment.file.name}</span>
              </div>

              <button
                type="button"
                className="remove_attachment_btn"
                onClick={() => removeAttachment(attachment.id)}
                aria-label="Remove attachment"
              >
                <HiOutlineXMark />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <div className="create_post_footer">
        <div className="create_post_tools">
          {/* ================= IMAGE ================= */}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={posting || selectedImages.length >= MAX_IMAGES}
          >
            <HiOutlinePhoto />
            Image
            {selectedImages.length > 0 &&
              ` (${selectedImages.length}/${MAX_IMAGES})`}
          </button>

          {/* ================= EMOJI - PHASE 3 ================= */}

          <button type="button" disabled={posting}>
            <HiOutlineFaceSmile />
            Emoji
          </button>

          {/* ================= ATTACHMENT ================= */}

          <button
            type="button"
            onClick={() => attachmentInputRef.current?.click()}
            disabled={posting || selectedAttachments.length >= MAX_ATTACHMENTS}
          >
            <HiOutlinePaperClip />
            Attachment
            {selectedAttachments.length > 0 &&
              ` (${selectedAttachments.length}/${MAX_ATTACHMENTS})`}
          </button>
        </div>

        {/* ================================================= */}
        {/* POST ACTIONS */}
        {/* ================================================= */}

        <div className="create_post_actions">
          <span>
            {content.length}/{MAX_LENGTH}
          </span>

          <button
            className="publish_btn"
            type="button"
            onClick={handlePost}
            disabled={
              (!content.trim() &&
                selectedImages.length === 0 &&
                selectedAttachments.length === 0) ||
              posting
            }
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
