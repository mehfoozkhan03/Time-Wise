import { useSelector } from 'react-redux'

import { FaLightbulb, FaHeart, FaUserFriends } from 'react-icons/fa'

import { IoTrendingUp } from 'react-icons/io5'

import './RightSidebar.css'

const RightSidebar = () => {
  const { featured, posts } = useSelector((state) => state.post)

  const trendingPosts = [...posts]
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, 5)

  const contributors = [
    ...new Map(
      posts.map((post) => [post.createdBy?._id, post.createdBy]),
    ).values(),
  ].slice(0, 5)

  return (
    <aside className="right-sidebar">
      {/* Featured Thought */}

      <section className="card right-sidebar-card">
        <div className="right-sidebar-title">
          <FaLightbulb />

          <h3>Featured Thought</h3>
        </div>

        {featured ? (
          <>
            <p>{featured.content}</p>

            <small>
              — {featured.createdBy?.firstName} {featured.createdBy?.lastName}
            </small>
          </>
        ) : (
          <p>No featured thought today.</p>
        )}
      </section>

      {/* Trending */}

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

      {/* Contributors */}

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
