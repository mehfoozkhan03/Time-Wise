// import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { useParams } from 'react-router-dom'

// import './Community.css'

// import { fetchPosts, fetchFeaturedThought } from '../../store/postSlice'

// import CreatePost from '../../components/community/CreatePost/CreatePost'
// import Feed from '../../components/community/Feed/Feed'
// import LeftSidebar from '../../components/community/Sidebar/LeftSidebar'
// import RightSidebar from '../../components/community/Sidebar/RightSidebar'

// const Community = () => {
//   const dispatch = useDispatch()

//   const { filter } = useParams()

//   const [sortBy, setSortBy] = useState('latest')

//   useEffect(() => {
//     dispatch(fetchPosts())
//     dispatch(fetchFeaturedThought())
//   }, [dispatch])

//   const getFeedType = () => {
//     switch (filter) {
//       case 'my-posts':
//         return 'my-posts'

//       case 'liked':
//         return 'liked'

//       case 'saved':
//         return 'saved'

//       case 'trending':
//         return 'trending'

//       default:
//         return 'feed'
//     }
//   }

//   return (
//     <div className="community-page">
//       <div className="community-layout">
//         <aside className="community-left">
//           <LeftSidebar />
//         </aside>

//         <main className="community-feed">
//           <CreatePost />

//           <div className="community-toolbar">
//             <h2>Community Feed</h2>
//             <div className="community-filters">
//               <button
//                 className={sortBy === 'latest' ? 'active' : ''}
//                 onClick={() => setSortBy('latest')}
//               >
//                 Latest
//               </button>

//               <button
//                 className={sortBy === 'oldest' ? 'active' : ''}
//                 onClick={() => setSortBy('oldest')}
//               >
//                 Oldest
//               </button>

//               <button
//                 className={sortBy === 'likes' ? 'active' : ''}
//                 onClick={() => setSortBy('likes')}
//               >
//                 Most Liked
//               </button>

//               <button
//                 className={sortBy === 'comments' ? 'active' : ''}
//                 onClick={() => setSortBy('comments')}
//               >
//                 Most Commented
//               </button>
//             </div>
//           </div>

//           <Feed type={getFeedType()} sortBy={sortBy} />
//         </main>

//         <aside className="community-right">
//           <RightSidebar />
//         </aside>
//       </div>
//     </div>
//   )
// }

// export default Community


import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import './Community.css'

import { fetchPosts, fetchFeaturedThought } from '../../store/postSlice'

import CreatePost from '../../components/community/CreatePost/CreatePost'
import Feed from '../../components/community/Feed/Feed'
import LeftSidebar from '../../components/community/Sidebar/LeftSidebar'
import RightSidebar from '../../components/community/Sidebar/RightSidebar'

import Skeleton from '../../components/Skeleton/Skeleton'


const Community = () => {
  const dispatch = useDispatch()

  const { filter } = useParams()

  const [sortBy, setSortBy] = useState('latest')

  // =========================
  // Skeleton State
  // =========================

  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])


  // =========================
  // Fetch Data
  // =========================

  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchFeaturedThought())
  }, [dispatch])


  // =========================
  // Feed Type
  // =========================

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


  // =====================================================
  // COMMUNITY SKELETON
  // =====================================================

  if (showSkeleton) {
    return (
      <div className="community-page">

        <div className="community-layout">


          {/* =================================================
              LEFT SIDEBAR SKELETON
          ================================================= */}

          <aside className="community-left">

            <div className="community-skeleton-sidebar">

              {/* Search */}

              <Skeleton
                width="100%"
                height="36px"
                radius="10px"
              />


              {/* Menu */}

              <div className="community-skeleton-menu">

                {[...Array(5)].map((_, index) => (
                  <div
                    className="community-skeleton-menu-item"
                    key={index}
                  >

                    <Skeleton
                      width="18px"
                      height="18px"
                      radius="4px"
                    />

                    <Skeleton
                      width={
                        index === 0
                          ? "55px"
                          : index === 1
                            ? "65px"
                            : index === 2
                              ? "80px"
                              : index === 3
                                ? "85px"
                                : "65px"
                      }
                      height="14px"
                      radius="4px"
                    />

                  </div>
                ))}

              </div>

            </div>

          </aside>


          {/* =================================================
              CENTER FEED SKELETON
          ================================================= */}

          <main className="community-feed">


            {/* ================= CREATE POST ================= */}

            <div className="community-skeleton-create">

              {/* User */}

              <div className="community-skeleton-user">

                <Skeleton
                  width="50px"
                  height="50px"
                  radius="50%"
                />

                <div className="community-skeleton-user-info">

                  <Skeleton
                    width="150px"
                    height="15px"
                  />

                  <Skeleton
                    width="190px"
                    height="13px"
                  />

                </div>

              </div>


              {/* Textarea */}

              <Skeleton
                width="100%"
                height="123px"
                radius="15px"
              />


              {/* Bottom buttons */}

              <div className="community-skeleton-post-actions">

                <Skeleton
                  width="87px"
                  height="37px"
                  radius="9px"
                />

                <Skeleton
                  width="84px"
                  height="37px"
                  radius="9px"
                />

                <Skeleton
                  width="115px"
                  height="37px"
                  radius="9px"
                />

                <Skeleton
                  width="40px"
                  height="15px"
                />

                <Skeleton
                  width="88px"
                  height="38px"
                  radius="9px"
                />

              </div>

            </div>


            {/* ================= TOOLBAR ================= */}

            <div className="community-skeleton-toolbar">

              <Skeleton
                width="150px"
                height="22px"
              />


              <div className="community-skeleton-filter">

                {[...Array(4)].map((_, index) => (
                  <Skeleton
                    key={index}
                    width={
                      index === 0
                        ? "63px"
                        : index === 1
                          ? "62px"
                          : index === 2
                            ? "88px"
                            : "125px"
                    }
                    height="36px"
                    radius="18px"
                  />
                ))}

              </div>

            </div>


            {/* ================= FEED POSTS ================= */}

            {[...Array(3)].map((_, index) => (

              <div
                className="community-skeleton-post"
                key={index}
              >

                {/* Header */}

                <div className="community-skeleton-post-header">

                  <Skeleton
                    width="50px"
                    height="50px"
                    radius="50%"
                  />

                  <div className="community-skeleton-post-user">

                    <Skeleton
                      width="120px"
                      height="16px"
                    />

                    <Skeleton
                      width="70px"
                      height="13px"
                    />

                    <Skeleton
                      width="95px"
                      height="11px"
                    />

                  </div>

                </div>


                {/* Post text */}

                <div className="community-skeleton-post-content">

                  <Skeleton
                    width="92%"
                    height="15px"
                  />

                  <Skeleton
                    width="72%"
                    height="15px"
                  />

                </div>


                {/* Post image for some cards */}

                {index === 0 && (
                  <Skeleton
                    width="100%"
                    height="180px"
                    radius="10px"
                  />
                )}


                {/* Actions */}

                <div className="community-skeleton-post-footer">

                  <Skeleton
                    width="65px"
                    height="30px"
                    radius="7px"
                  />

                  <Skeleton
                    width="75px"
                    height="30px"
                    radius="7px"
                  />

                  <Skeleton
                    width="70px"
                    height="30px"
                    radius="7px"
                  />

                  <Skeleton
                    width="35px"
                    height="25px"
                    radius="5px"
                  />

                </div>

              </div>

            ))}

          </main>


          {/* =================================================
              RIGHT SIDEBAR SKELETON
          ================================================= */}

          <aside className="community-right">


            {/* Featured Thought */}

            <div className="community-skeleton-right-card">

              <div className="community-skeleton-right-title">

                <Skeleton
                  width="18px"
                  height="18px"
                  radius="4px"
                />

                <Skeleton
                  width="125px"
                  height="17px"
                />

              </div>


              <Skeleton
                width="90%"
                height="1px"
              />


              <Skeleton
                width="85%"
                height="14px"
              />

              <Skeleton
                width="95%"
                height="14px"
              />

              <Skeleton
                width="65%"
                height="14px"
              />


              <Skeleton
                width="100px"
                height="13px"
              />

            </div>


            {/* Trending Posts */}

            <div className="community-skeleton-right-card">

              <div className="community-skeleton-right-title">

                <Skeleton
                  width="18px"
                  height="18px"
                  radius="4px"
                />

                <Skeleton
                  width="120px"
                  height="17px"
                />

              </div>


              <Skeleton
                width="90%"
                height="1px"
              />


              {[...Array(5)].map((_, index) => (

                <div
                  className="community-skeleton-trending"
                  key={index}
                >

                  <div>

                    <Skeleton
                      width="95px"
                      height="13px"
                    />

                    <Skeleton
                      width="135px"
                      height="11px"
                    />

                  </div>


                  <Skeleton
                    width="30px"
                    height="15px"
                  />

                </div>

              ))}

            </div>


            {/* Contributors */}

            <div className="community-skeleton-right-card">

              <div className="community-skeleton-right-title">

                <Skeleton
                  width="18px"
                  height="18px"
                  radius="4px"
                />

                <Skeleton
                  width="125px"
                  height="17px"
                />

              </div>


              {[...Array(3)].map((_, index) => (

                <div
                  className="community-skeleton-contributor"
                  key={index}
                >

                  <Skeleton
                    width="38px"
                    height="38px"
                    radius="50%"
                  />

                  <div>

                    <Skeleton
                      width="90px"
                      height="13px"
                    />

                    <Skeleton
                      width="65px"
                      height="11px"
                    />

                  </div>

                </div>

              ))}

            </div>


          </aside>

        </div>

      </div>
    )
  }


  // =====================================================
  // REAL COMMUNITY UI
  // =====================================================

  return (
    <div className="community-page">

      <div className="community-layout">

        <aside className="community-left">
          <LeftSidebar />
        </aside>


        <main className="community-feed">

          <CreatePost />


          <div className="community-toolbar">

            <h2>
              Community Feed
            </h2>

            <div className="community-filters">

              <button
                className={
                  sortBy === 'latest'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setSortBy('latest')
                }
              >
                Latest
              </button>


              <button
                className={
                  sortBy === 'oldest'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setSortBy('oldest')
                }
              >
                Oldest
              </button>


              <button
                className={
                  sortBy === 'likes'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setSortBy('likes')
                }
              >
                Most Liked
              </button>


              <button
                className={
                  sortBy === 'comments'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setSortBy('comments')
                }
              >
                Most Commented
              </button>

            </div>

          </div>


          <Feed
            type={getFeedType()}
            sortBy={sortBy}
          />

        </main>


        <aside className="community-right">
          <RightSidebar />
        </aside>

      </div>

    </div>
  )
}


export default Community