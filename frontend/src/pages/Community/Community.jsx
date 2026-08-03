import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import './Community.css'

import { fetchPosts, fetchFeaturedThought } from '../../store/postSlice'

import CreatePost from '../../components/community/CreatePost/CreatePost'
import Feed from '../../components/community/Feed/Feed'
import LeftSidebar from '../../components/community/Sidebar/LeftSidebar'
import RightSidebar from '../../components/community/Sidebar/RightSidebar'

const Community = () => {
  const dispatch = useDispatch()

  const { filter } = useParams()

  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchFeaturedThought())
  }, [dispatch])

  const getFeedType = () => {
    switch (filter) {
      case 'my-posts':
        return 'my-posts'

      case 'liked':
        return 'liked'

      case 'saved':
        return 'saved'

      case 'trending':
        return 'trending'

      default:
        return 'feed'
    }
  }

  return (
    <div className="community-page">
      <div className="community-layout">
        <aside className="community-left">
          <LeftSidebar />
        </aside>

        <main className="community-feed">
          <CreatePost />

          <Feed type={getFeedType()} />
        </main>

        <aside className="community-right">
          <RightSidebar />
        </aside>
      </div>
    </div>
  )
}

export default Community
