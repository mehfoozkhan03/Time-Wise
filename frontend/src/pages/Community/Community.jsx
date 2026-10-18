import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import './Community.css'

import { fetchPosts, fetchFeaturedThought } from '../../store/postSlice'

import CreatePost from '../../components/community/CreatePost/CreatePost'
import Feed from '../../components/community/Feed/Feed'
import LeftSidebar from '../../components/community/Sidebar/LeftSidebar'
import RightSidebar from '../../components/community/Sidebar/RightSidebar'
import SharePageUrl from '../../components/SharePageUrl/SharePageUrl'
import Skeleton from '../../components/Skeleton/Skeleton'

const VALID_TABS = ['feed', 'my-posts', 'liked', 'saved', 'trending']
const VALID_SORTS = ['latest', 'oldest', 'likes', 'comments']

const Community = () => {
  const dispatch = useDispatch()

  const { filter } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

  const { loading } = useSelector((state) => state.post || {})

  // Read the selected feed tab and sorting option from the URL.
  const tabFromUrl = searchParams.get('tab')
  const sortFromUrl = searchParams.get('sort')

  const tab = VALID_TABS.includes(tabFromUrl)
    ? tabFromUrl
    : VALID_TABS.includes(filter)
      ? filter
      : 'feed'

  const sortBy = VALID_SORTS.includes(sortFromUrl) ? sortFromUrl : 'latest'

  // Keep the URL synchronized with the current tab and sorting option.
  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    params.set('tab', tab)
    params.set('sort', sortBy)

    const nextSearch = `?${params.toString()}`

    if (location.pathname !== '/community' || location.search !== nextSearch) {
      navigate(
        {
          pathname: '/community',
          search: nextSearch,
        },
        { replace: true },
      )
    }
  }, [tab, sortBy, location.pathname, location.search, navigate, searchParams])

  // Update sorting while preserving the other query parameters.
  const updateSort = (newSort) => {
    const params = new URLSearchParams(searchParams)

    params.set('tab', tab)
    params.set('sort', newSort)

    setSearchParams(params)
  }

  // Fetch community data.
  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchFeaturedThought())
  }, [dispatch])

  const getFeedType = () => tab

  // Community loading skeleton.
  if (loading) {
    return (
      <div className="community-page">
        <div className="community-layout">
          {/* Left sidebar skeleton */}
          <aside className="community-left">
            <div className="community-skeleton-sidebar">
              <Skeleton width="100%" height="36px" radius="10px" />

              <div className="community-skeleton-menu">
                {[...Array(5)].map((_, index) => (
                  <div className="community-skeleton-menu-item" key={index}>
                    <Skeleton width="18px" height="18px" radius="4px" />

                    <Skeleton
                      width={
                        index === 0
                          ? '55px'
                          : index === 1
                            ? '65px'
                            : index === 2
                              ? '80px'
                              : index === 3
                                ? '85px'
                                : '65px'
                      }
                      height="14px"
                      radius="4px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Center feed skeleton */}
          <main className="community-feed">
            {/* Create post skeleton */}
            <div className="community-skeleton-create">
              <div className="community-skeleton-user">
                <Skeleton width="50px" height="50px" radius="50%" />

                <div className="community-skeleton-user-info">
                  <Skeleton width="150px" height="15px" />
                  <Skeleton width="190px" height="13px" />
                </div>
              </div>

              <Skeleton width="100%" height="123px" radius="15px" />

              <div className="community-skeleton-post-actions">
                <Skeleton width="87px" height="37px" radius="9px" />
                <Skeleton width="84px" height="37px" radius="9px" />
                <Skeleton width="115px" height="37px" radius="9px" />
                <Skeleton width="40px" height="15px" />
                <Skeleton width="88px" height="38px" radius="9px" />
              </div>
            </div>

            {/* Toolbar skeleton */}
            <div className="community-skeleton-toolbar">
              <Skeleton width="150px" height="22px" />

              <div className="community-skeleton-filter">
                {[...Array(4)].map((_, index) => (
                  <Skeleton
                    key={index}
                    width={
                      index === 0
                        ? '63px'
                        : index === 1
                          ? '62px'
                          : index === 2
                            ? '88px'
                            : '125px'
                    }
                    height="36px"
                    radius="18px"
                  />
                ))}
              </div>
            </div>

            {/* Feed post skeletons */}
            {[...Array(3)].map((_, index) => (
              <div className="community-skeleton-post" key={index}>
                <div className="community-skeleton-post-header">
                  <Skeleton width="50px" height="50px" radius="50%" />

                  <div className="community-skeleton-post-user">
                    <Skeleton width="120px" height="16px" />
                    <Skeleton width="70px" height="13px" />
                    <Skeleton width="95px" height="11px" />
                  </div>
                </div>

                <div className="community-skeleton-post-content">
                  <Skeleton width="92%" height="15px" />
                  <Skeleton width="72%" height="15px" />
                </div>

                {index === 0 && (
                  <Skeleton width="100%" height="180px" radius="10px" />
                )}

                <div className="community-skeleton-post-footer">
                  <Skeleton width="65px" height="30px" radius="7px" />
                  <Skeleton width="75px" height="30px" radius="7px" />
                  <Skeleton width="70px" height="30px" radius="7px" />
                  <Skeleton width="35px" height="25px" radius="5px" />
                </div>
              </div>
            ))}
          </main>

          {/* Right sidebar skeleton */}
          <aside className="community-right">
            {/* Featured thought */}
            <div className="community-skeleton-right-card">
              <div className="community-skeleton-right-title">
                <Skeleton width="18px" height="18px" radius="4px" />
                <Skeleton width="125px" height="17px" />
              </div>

              <Skeleton width="90%" height="1px" />
              <Skeleton width="85%" height="14px" />
              <Skeleton width="95%" height="14px" />
              <Skeleton width="65%" height="14px" />
              <Skeleton width="100px" height="13px" />
            </div>

            {/* Trending posts */}
            <div className="community-skeleton-right-card">
              <div className="community-skeleton-right-title">
                <Skeleton width="18px" height="18px" radius="4px" />
                <Skeleton width="120px" height="17px" />
              </div>

              <Skeleton width="90%" height="1px" />

              {[...Array(5)].map((_, index) => (
                <div className="community-skeleton-trending" key={index}>
                  <div>
                    <Skeleton width="95px" height="13px" />
                    <Skeleton width="135px" height="11px" />
                  </div>

                  <Skeleton width="30px" height="15px" />
                </div>
              ))}
            </div>

            {/* Contributors */}
            <div className="community-skeleton-right-card">
              <div className="community-skeleton-right-title">
                <Skeleton width="18px" height="18px" radius="4px" />
                <Skeleton width="125px" height="17px" />
              </div>

              {[...Array(3)].map((_, index) => (
                <div className="community-skeleton-contributor" key={index}>
                  <Skeleton width="38px" height="38px" radius="50%" />

                  <div>
                    <Skeleton width="90px" height="13px" />
                    <Skeleton width="65px" height="11px" />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    )
  }

  // Main community UI.
  return (
    <div className="community-page">
      <div className="community-layout">
        <aside className="community-left">
          <LeftSidebar />
        </aside>

        <main className="community-feed">
          <CreatePost />

          <div className="community-toolbar">
            <div className="community-toolbar-heading">
              <h2>Community Feed</h2>

              <SharePageUrl label="Share" className="community-share-control" />
            </div>

            <div className="community-filters">
              <button
                type="button"
                className={sortBy === 'latest' ? 'active' : ''}
                onClick={() => updateSort('latest')}
              >
                Latest
              </button>

              <button
                type="button"
                className={sortBy === 'oldest' ? 'active' : ''}
                onClick={() => updateSort('oldest')}
              >
                Oldest
              </button>

              <button
                type="button"
                className={sortBy === 'likes' ? 'active' : ''}
                onClick={() => updateSort('likes')}
              >
                Most Liked
              </button>

              <button
                type="button"
                className={sortBy === 'comments' ? 'active' : ''}
                onClick={() => updateSort('comments')}
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
