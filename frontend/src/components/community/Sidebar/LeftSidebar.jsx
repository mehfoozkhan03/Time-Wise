import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import {
  FaHome,
  FaRegNewspaper,
  FaHeart,
  FaBookmark,
  FaSearch,
} from 'react-icons/fa'

import { IoTrendingUp } from 'react-icons/io5'

import { setSearchQuery } from '../../../store/postSlice'

import './LeftSidebar.css'

const sidebarItems = [
  { id: 'feed', label: 'Feed', icon: FaHome },
  { id: 'my-posts', label: 'My Posts', icon: FaRegNewspaper, count: 'myPosts' },
  { id: 'liked', label: 'Liked Posts', icon: FaHeart, count: 'likedPosts' },
  { id: 'saved', label: 'Saved Posts', icon: FaBookmark, count: 'savedPosts' },
  { id: 'trending', label: 'Trending', icon: IoTrendingUp },
]

const LeftSidebar = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()

  const { posts = [], searchQuery = '' } = useSelector((state) => state.post)

  const { user } = useSelector((state) => state.auth)

  const activeTab = searchParams.get('tab') || 'feed'
  const sortBy = searchParams.get('sort') || 'latest'

  const myPostsCount = posts.filter((post) => {
    const authorId = post.createdBy?._id || post.createdBy
    return authorId?.toString() === user?._id?.toString()
  }).length

  const likedPostsCount = posts.filter((post) => post.isLiked).length

  const savedPostsCount = posts.filter((post) => post.isSaved).length

  const counts = {
    myPosts: myPostsCount,
    likedPosts: likedPostsCount,
    savedPosts: savedPostsCount,
  }

  const getTabUrl = (tab) => {
    const params = new URLSearchParams(searchParams)

    params.set('tab', tab)
    params.set('sort', sortBy)

    return `/community?${params.toString()}`
  }

  return (
    <aside className="left-sidebar card">
      <div className="left-sidebar-search">
        <FaSearch />

        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>

      <nav className="left-sidebar-nav">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Link
              key={item.id}
              to={getTabUrl(item.id)}
              className={`left-sidebar-link${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon />

              <span>{item.label}</span>

              {item.count && <small>{counts[item.count]}</small>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default LeftSidebar
