import { NavLink } from 'react-router-dom'

import {
  FaHome,
  FaRegNewspaper,
  FaHeart,
  FaBookmark,
  FaSearch,
} from 'react-icons/fa'

import { IoTrendingUp } from 'react-icons/io5'

import { useSelector } from 'react-redux'

import './LeftSidebar.css'

const LeftSidebar = () => {
  const { posts } = useSelector((state) => state.post)
  const { user } = useSelector((state) => state.auth)

  const myPostsCount =
    posts?.filter((post) => post.createdBy?._id === user?._id).length || 0

  const likedPostsCount = posts?.filter((post) => post.isLiked).length || 0

  const savedPostsCount = 0

  return (
    <aside className="left-sidebar card">
      <div className="left-sidebar-search">
        <FaSearch />

        <input type="text" placeholder="Search posts..." />
      </div>

      <nav className="left-sidebar-nav">
        <NavLink
          end
          to="/community"
          className={({ isActive }) =>
            isActive ? 'left-sidebar-link active' : 'left-sidebar-link'
          }
        >
          <FaHome />

          <span>Feed</span>
        </NavLink>

        <NavLink
          to="/community/my-posts"
          className={({ isActive }) =>
            isActive ? 'left-sidebar-link active' : 'left-sidebar-link'
          }
        >
          <FaRegNewspaper />

          <span>My Posts</span>

          <small>{myPostsCount}</small>
        </NavLink>

        <NavLink
          to="/community/liked"
          className={({ isActive }) =>
            isActive ? 'left-sidebar-link active' : 'left-sidebar-link'
          }
        >
          <FaHeart />

          <span>Liked Posts</span>

          <small>{likedPostsCount}</small>
        </NavLink>

        <NavLink
          to="/community/saved"
          className={({ isActive }) =>
            isActive ? 'left-sidebar-link active' : 'left-sidebar-link'
          }
        >
          <FaBookmark />

          <span>Saved Posts</span>

          <small>{savedPostsCount}</small>
        </NavLink>

        <NavLink
          to="/community/trending"
          className={({ isActive }) =>
            isActive ? 'left-sidebar-link active' : 'left-sidebar-link'
          }
        >
          <IoTrendingUp />

          <span>Trending</span>
        </NavLink>
      </nav>
    </aside>
  )
}

export default LeftSidebar
