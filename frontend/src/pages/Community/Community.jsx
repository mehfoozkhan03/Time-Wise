import './Community.css'

import LeftSidebar from '../../components/community/Sidebar/LeftSidebar'
import RightSidebar from '../../components/community/Sidebar/RightSidebar'
import CreatePost from '../../components/community/CreatePost/CreatePost'
import Feed from '../../components/community/Feed/Feed'

const Community = () => {
  return (
    <div className="community_page">
      <div className="community_container">
        <aside className="community_left">
          <LeftSidebar />
        </aside>

        <main className="community_main">
          <CreatePost />
          <Feed />
        </main>

        <aside className="community_right">
          <RightSidebar />
        </aside>
      </div>
    </div>
  )
}

export default Community
