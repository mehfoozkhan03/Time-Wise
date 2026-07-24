import { useSelector } from 'react-redux'
import { FaLightbulb, FaHeart, FaUserFriends } from 'react-icons/fa'
import { IoTrendingUp } from 'react-icons/io5'

import './RightSidebar.css'

const RightSidebar = () => {
  const { featured, posts } = useSelector((state) => state.post)

  const trendingPosts = [...posts]
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, 5)

  const contributors = [...posts]
    .map((post) => post.author)
    .filter(
      (author, index, self) =>
        author && self.findIndex((item) => item?._id === author?._id) === index,
    )
    .slice(0, 5)

  return (
    <aside className="right-sidebar">
      <section className="card right-sidebar-card">
        <div className="right-sidebar-title">
          <FaLightbulb />

          <h3>Featured Thought</h3>
        </div>

        {featured ? (
          <>
            <h4>{featured.title}</h4>

            <p>{featured.content}</p>

            <small>— {featured.author?.name}</small>
          </>
        ) : (
          <p>No featured thought today.</p>
        )}
      </section>

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
                  <strong>{post.author?.name}</strong>

                  <small>{post.title || 'Community Post'}</small>
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

      <section className="card right-sidebar-card">
        <div className="right-sidebar-title">
          <FaUserFriends />

          <h3>Top Contributors</h3>
        </div>

        <div className="right-sidebar-list">
          {contributors.length === 0 ? (
            <small>No contributors yet.</small>
          ) : (
            contributors.map((user) => (
              <div key={user._id} className="contributor-item">
                <div className="contributor-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="contributor-info">
                  <strong>{user.name}</strong>

                  <small>{user.designation}</small>
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
