import { useSelector } from 'react-redux'
import {
  FaLightbulb,
  FaHeart,
  FaUserFriends,
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaPaperclip,
} from 'react-icons/fa'
import { IoTrendingUp } from 'react-icons/io5'
import { useEffect, useRef, useState } from 'react'

import './RightSidebar.css'

// Get images from both the current images array and legacy image field.
const getPostImages = (post) => {
  if (Array.isArray(post?.images) && post.images.length > 0) {
    return post.images
      .map((image) => (typeof image === 'string' ? { url: image } : image))
      .filter((image) => image?.url)
  }

  if (typeof post?.image === 'string' && post.image) {
    return [{ url: post.image, alt: 'Post image' }]
  }

  if (post?.image?.url) {
    return [post.image]
  }

  return []
}

const getPostAttachments = (post) =>
  Array.isArray(post?.attachments)
    ? post.attachments.filter((attachment) => attachment?.url)
    : []

const RightSidebar = () => {
  const { featured, posts = [] } = useSelector((state) => state.post)

  const [isThoughtExpanded, setIsThoughtExpanded] = useState(false)
  const [isThoughtLong, setIsThoughtLong] = useState(false)

  const thoughtRef = useRef(null)

  const trendingPosts = [...posts]
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, 5)

  const contributors = [
    ...new Map(
      posts
        .filter((post) => post.createdBy?._id)
        .map((post) => [post.createdBy._id, post.createdBy]),
    ).values(),
  ].slice(0, 5)

  const featuredMessage = featured?.content || ''
  const featuredImages = getPostImages(featured)
  const featuredAttachments = getPostAttachments(featured)

  useEffect(() => {
    setIsThoughtExpanded(false)

    if (!featuredMessage || !thoughtRef.current) {
      setIsThoughtLong(false)
      return
    }

    const checkThoughtHeight = () => {
      const element = thoughtRef.current
      if (!element) return

      const computedStyle = window.getComputedStyle(element)
      let lineHeight = parseFloat(computedStyle.lineHeight)

      if (Number.isNaN(lineHeight)) {
        lineHeight = (parseFloat(computedStyle.fontSize) || 16) * 1.6
      }

      const maxHeight = lineHeight * 6
      const previousDisplay = element.style.display
      const previousWebkitLineClamp = element.style.webkitLineClamp
      const previousOverflow = element.style.overflow

      element.style.display = 'block'
      element.style.webkitLineClamp = 'unset'
      element.style.overflow = 'visible'

      const fullHeight = element.scrollHeight

      element.style.display = previousDisplay
      element.style.webkitLineClamp = previousWebkitLineClamp
      element.style.overflow = previousOverflow

      setIsThoughtLong(fullHeight > maxHeight + 5)
    }

    const timeout = setTimeout(checkThoughtHeight, 50)
    window.addEventListener('resize', checkThoughtHeight)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', checkThoughtHeight)
    }
  }, [featuredMessage])

  const renderMediaPreview = (post, compact = false) => {
    const images = getPostImages(post)
    const attachments = getPostAttachments(post)

    if (!images.length && !attachments.length) return null

    return (
      <div
        className={`sidebar-media-preview ${
          compact ? 'sidebar-media-compact' : ''
        }`}
      >
        {images.length > 0 && (
          <div className="sidebar-image-preview">
            {images.slice(0, compact ? 1 : 3).map((image, index) => (
              <img
                key={image.publicId || image.url || index}
                src={image.url}
                alt={image.alt || 'Post attachment'}
                loading="lazy"
              />
            ))}
            {images.length > (compact ? 1 : 3) && (
              <span className="sidebar-media-count">
                +{images.length - (compact ? 1 : 3)}
              </span>
            )}
          </div>
        )}

        {attachments.slice(0, compact ? 1 : 3).map((attachment, index) => (
          <div
            className="sidebar-file-preview"
            key={attachment.publicId || attachment.url || index}
            title={attachment.originalName || 'Attachment'}
          >
            <FaFileAlt className="sidebar-file-icon" />
            <span>{attachment.originalName || 'Attached file'}</span>
            <FaPaperclip className="sidebar-file-clip" />
          </div>
        ))}

        {attachments.length > (compact ? 1 : 3) && (
          <small className="sidebar-extra-files">
            +{attachments.length - (compact ? 1 : 3)} more file(s)
          </small>
        )}
      </div>
    )
  }

  return (
    <aside className="right-sidebar">
      {/* FEATURED THOUGHT */}
      <section className="card right-sidebar-card featured-thought-sidebar">
        <div className="right-sidebar-title">
          <FaLightbulb />
          <h3>Featured Thought</h3>
        </div>

        {featured ? (
          <div className="featured-thought-content">
            {featuredMessage && (
              <div
                ref={thoughtRef}
                className={`featured-thought-text ${
                  isThoughtLong
                    ? isThoughtExpanded
                      ? 'expanded'
                      : 'collapsed'
                    : 'short'
                }`}
              >
                {featuredMessage}
              </div>
            )}

            {isThoughtLong && (
              <button
                type="button"
                className="featured-thought-toggle"
                onClick={() => setIsThoughtExpanded((prev) => !prev)}
                aria-expanded={isThoughtExpanded}
              >
                <span>{isThoughtExpanded ? 'Show less' : 'Load more'}</span>
                {isThoughtExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            )}

            {renderMediaPreview(featured)}

            <small className="featured-thought-author">
              —{' '}
              {`${featured.createdBy?.firstName || ''} ${
                featured.createdBy?.lastName || ''
              }`.trim() || 'Unknown author'}
            </small>
          </div>
        ) : (
          <p className="featured-thought-empty">No featured thought today.</p>
        )}
      </section>

      {/* TRENDING POSTS */}
      <section className="card right-sidebar-card">
        <div className="right-sidebar-title">
          <IoTrendingUp />
          <h3>Trending Posts</h3>
        </div>

        <div className="right-sidebar-list">
          {trendingPosts.length === 0 ? (
            <small>No trending posts.</small>
          ) : (
            trendingPosts.map((post) => {
              const content = post.content || ''

              return (
                <div key={post._id} className="trending-item">
                  <div className="trending-item-main">
                    <strong>
                      {post.createdBy?.firstName} {post.createdBy?.lastName}
                    </strong>

                    {content && (
                      <small>
                        {content.length > 45
                          ? `${content.slice(0, 45)}...`
                          : content}
                      </small>
                    )}

                    {renderMediaPreview(post, true)}
                  </div>

                  <span className="trending-likes">
                    <FaHeart />
                    {post.likesCount || 0}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* TOP CONTRIBUTORS */}
      <section className="card right-sidebar-card">
        <div className="right-sidebar-title">
          <FaUserFriends />
          <h3>Top Contributors</h3>
        </div>

        <div className="right-sidebar-list">
          {contributors.length === 0 ? (
            <small>No contributors yet.</small>
          ) : (
            contributors.map((person) => (
              <div key={person._id} className="contributor-item">
                <div className="contributor-avatar">
                  {`${person.firstName?.[0] || ''}${
                    person.lastName?.[0] || ''
                  }`.toUpperCase()}
                </div>

                <div className="contributor-info">
                  <strong>
                    {person.firstName} {person.lastName}
                  </strong>
                  <small>{person.designation || 'Employee'}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </aside>
  )
}

export default RightSidebar
