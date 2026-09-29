import { useSelector } from 'react-redux'
import {
  FaLightbulb,
  FaHeart,
  FaUserFriends,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa'
import { IoTrendingUp } from 'react-icons/io5'
import { useEffect, useRef, useState } from 'react'

import './RightSidebar.css'

const RightSidebar = () => {
  const { featured, posts } = useSelector((state) => state.post)

  // ==========================================
  // FEATURED THOUGHT STATE
  // ==========================================

  const [isThoughtExpanded, setIsThoughtExpanded] = useState(false)

  const [isThoughtLong, setIsThoughtLong] = useState(false)

  const thoughtRef = useRef(null)

  // ==========================================
  // TRENDING POSTS
  // ==========================================

  const trendingPosts = [...posts]
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, 5)

  // ==========================================
  // CONTRIBUTORS
  // ==========================================

  const contributors = [
    ...new Map(
      posts.map((post) => [post.createdBy?._id, post.createdBy]),
    ).values(),
  ].slice(0, 5)

  // ==========================================
  // LATEST PINNED THOUGHT
  // ==========================================

  const latestPinnedPost =
    [...posts]
      .filter((post) => post.isPinned === true && post.isDeleted !== true)
      .sort((a, b) => new Date(b.pinnedAt) - new Date(a.pinnedAt))[0] || null

  // ==========================================
  // FEATURED MESSAGE
  // ==========================================

  const featuredMessage = latestPinnedPost?.content || featured?.content || ''

  // ==========================================
  // CHECK WHETHER THOUGHT IS LONG
  // ==========================================

  useEffect(() => {
    setIsThoughtExpanded(false)

    if (!featuredMessage || !thoughtRef.current) {
      setIsThoughtLong(false)
      return
    }

    const checkThoughtHeight = () => {
      const element = thoughtRef.current

      if (!element) return

      // Get computed line height
      const computedStyle = window.getComputedStyle(element)

      let lineHeight = parseFloat(computedStyle.lineHeight)

      // Fallback if line-height is "normal"
      if (isNaN(lineHeight)) {
        const fontSize = parseFloat(computedStyle.fontSize) || 16

        lineHeight = fontSize * 1.6
      }

      // Six lines
      const maxHeight = lineHeight * 6

      // Temporarily remove clamp to determine
      // the natural height of the full thought
      const previousDisplay = element.style.display

      const previousWebkitLineClamp = element.style.webkitLineClamp

      const previousOverflow = element.style.overflow

      element.style.display = 'block'
      element.style.webkitLineClamp = 'unset'
      element.style.overflow = 'visible'

      const fullHeight = element.scrollHeight

      // Restore original styles
      element.style.display = previousDisplay

      element.style.webkitLineClamp = previousWebkitLineClamp

      element.style.overflow = previousOverflow

      setIsThoughtLong(fullHeight > maxHeight + 5)
    }

    // Allow browser to finish rendering first
    const timeout = setTimeout(checkThoughtHeight, 50)

    window.addEventListener('resize', checkThoughtHeight)

    return () => {
      clearTimeout(timeout)

      window.removeEventListener('resize', checkThoughtHeight)
    }
  }, [featuredMessage])

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <aside className="right-sidebar">
      {/* ======================================
          FEATURED THOUGHT
      ====================================== */}

      <section className="card right-sidebar-card featured-thought-sidebar">
        <div className="right-sidebar-title">
          <FaLightbulb />

          <h3>Featured Thought</h3>
        </div>

        {featuredMessage ? (
          <div className="featured-thought-content">
            {/* THOUGHT */}
            <div
              ref={thoughtRef}
              className={`featured-thought-text ${
                isThoughtExpanded ? 'expanded' : 'collapsed'
              }`}
            >
              {featuredMessage}
            </div>

            {/* LOAD MORE */}
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

            {/* AUTHOR */}
            <small className="featured-thought-author">
              —{' '}
              {latestPinnedPost
                ? `${latestPinnedPost.createdBy?.firstName || ''} ${
                    latestPinnedPost.createdBy?.lastName || ''
                  }`.trim()
                : `${featured?.createdBy?.firstName || ''} ${
                    featured?.createdBy?.lastName || ''
                  }`.trim()}
            </small>
          </div>
        ) : (
          <p className="featured-thought-empty">No featured thought today.</p>
        )}
      </section>

      {/* ======================================
          TRENDING POSTS
      ====================================== */}

      <section className="card right-sidebar-card">
        <div className="right-sidebar-title">
          <IoTrendingUp />

          <h3>Trending Posts</h3>
        </div>

        <div className="right-sidebar-list">
          {trendingPosts.length === 0 ? (
            <small>No trending posts.</small>
          ) : (
            trendingPosts.map((post) => (
              <div key={post._id} className="trending-item">
                <div>
                  <strong>
                    {post.createdBy?.firstName} {post.createdBy?.lastName}
                  </strong>

                  <small>
                    {post.content.length > 25
                      ? `${post.content.slice(0, 25)}...`
                      : post.content}
                  </small>
                </div>

                <span>
                  <FaHeart />

                  {post.likesCount || 0}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ======================================
          TOP CONTRIBUTORS
      ====================================== */}

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
