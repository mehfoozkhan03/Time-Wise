import './LeftSidebar.css'

import {
  HiOutlineMagnifyingGlass,
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineHeart,
} from 'react-icons/hi2'

const LeftSidebar = () => {
  return (
    <aside className="left_sidebar">
      {/* Search */}

      <div className="sidebar_search">
        <HiOutlineMagnifyingGlass className="search_icon" />

        <input type="text" placeholder="Search posts..." />
      </div>

      {/* Navigation */}

      <div className="sidebar_section">
        <button className="sidebar_item active">
          <HiOutlineHome />

          <span>Feed</span>
        </button>

        <button className="sidebar_item">
          <HiOutlineDocumentText />

          <span>My Posts</span>
        </button>

        <button className="sidebar_item">
          <HiOutlineHeart />

          <span>Liked Posts</span>
        </button>
      </div>
    </aside>
  )
}

export default LeftSidebar
