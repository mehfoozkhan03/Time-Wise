import { useEffect, useState } from 'react'
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

  const [sortBy, setSortBy] = useState('latest')

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

          <div className="community-toolbar">
            <h2>Community Feed</h2>
            <div className="community-filters">
              <button
                className={sortBy === 'latest' ? 'active' : ''}
                onClick={() => setSortBy('latest')}
              >
                Latest
              </button>

              <button
                className={sortBy === 'oldest' ? 'active' : ''}
                onClick={() => setSortBy('oldest')}
              >
                Oldest
              </button>

              <button
                className={sortBy === 'likes' ? 'active' : ''}
                onClick={() => setSortBy('likes')}
              >
                Most Liked
              </button>

              <button
                className={sortBy === 'comments' ? 'active' : ''}
                onClick={() => setSortBy('comments')}
              >
                Most Commented
              </button>
            </div>
          </div>

          <Feed type={getFeedType()} sortBy={sortBy} />
        </main>

        <aside className="community-right">
          <RightSidebar />
        </aside>
      </div>
    </div>
  )
}

export default Community
