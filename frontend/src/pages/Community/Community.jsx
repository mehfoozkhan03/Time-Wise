import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import './Community.css'

import { fetchPosts, fetchFeaturedThought } from '../../store/postSlice'

import CreatePost from '../../components/Community/CreatePost/CreatePost'
import Feed from '../../components/Community/Feed/Feed'
import LeftSidebar from '../../components/Community/Sidebar/LeftSidebar'
import RightSidebar from '../../components/community/Sidebar/RightSidebar'

const Community = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchFeaturedThought())
  }, [dispatch])

  return (
    <div className="community-page">
      <div className="community-layout">
        <aside className="community-left">
          <LeftSidebar />
        </aside>

        <main className="community-feed">
          <CreatePost />

          <Feed />
        </main>

        <aside className="community-right">
          <RightSidebar />
        </aside>
      </div>
    </div>
  )
}

export default Community
