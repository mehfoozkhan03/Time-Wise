import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Skeleton from '../../Skeleton/Skeleton'
import './DevelopmentHistory.css'

const milestones = [
  {
    number: '01',
    title: 'Building the Foundation',
    description:
      'Establishing the core structure of TimeWise and building the foundation for an integrated employee management experience.',
    category: 'Core Development',
  },
  {
    number: '02',
    title: 'Attendance Management',
    description:
      'Developing employee attendance workflows, including check-in, check-out, breaks, and working-time tracking.',
    category: 'Employee Management',
  },
  {
    number: '03',
    title: 'Community Experience',
    description:
      'Building the Community page with post navigation, profile pages, and URL-based navigation and sharing.',
    category: 'Community',
  },
  {
    number: '04',
    title: 'Working Hours & Holidays',
    description:
      'Bringing working-hours information and holiday handling into the employee experience.',
    category: 'Scheduling',
  },
]

function DevelopmentHistory() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900)
    return () => window.clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section className="development-history-section" aria-label="Loading development history" aria-busy="true">
        <div className="development-history-container development-history-skeleton">
          <div className="development-history-heading">
            <Skeleton width="150px" height="13px" />
            <Skeleton className="development-skeleton-title" width="min(600px, 90%)" height="48px" />
            <Skeleton width="min(560px, 90%)" height="18px" />
            <Skeleton width="min(420px, 75%)" height="18px" />
          </div>
          <div className="development-history-grid">
            {milestones.map((milestone) => (
              <div className="development-history-card" key={milestone.number}>
                <div className="development-skeleton-card-top">
                  <Skeleton width="46px" height="46px" radius="14px" />
                  <Skeleton width="130px" height="28px" radius="999px" />
                </div>
                <Skeleton width="72%" height="23px" />
                <Skeleton width="100%" height="14px" />
                <Skeleton width="86%" height="14px" />
              </div>
            ))}
          </div>
          <div className="development-history-footer">
            <div className="development-history-footer-copy">
              <Skeleton width="min(380px, 90%)" height="24px" />
              <Skeleton width="min(520px, 100%)" height="15px" />
            </div>
            <Skeleton width="190px" height="48px" radius="12px" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="development-history-section"
      aria-labelledby="development-history-title"
    >
      <div className="development-history-container">
        <div className="development-history-heading">
          <span className="development-history-eyebrow">BEHIND THE BUILD</span>

          <h2 id="development-history-title">
            Every feature has a <span>story.</span>
          </h2>

          <p>
            TimeWise is an evolving project shaped by ideas, implementation,
            testing, and iteration. Explore the milestones behind its
            development.
          </p>
        </div>

        <div className="development-history-grid">
          {milestones.map((milestone) => (
            <article
              className="development-history-card"
              key={milestone.number}
            >
              <div className="development-history-card-top">
                <span className="development-history-number">
                  {milestone.number}
                </span>

                <span className="development-history-category">
                  {milestone.category}
                </span>
              </div>

              <h3>{milestone.title}</h3>

              <p>{milestone.description}</p>
            </article>
          ))}
        </div>

        <div className="development-history-footer">
          <div className="development-history-footer-copy">
            <h3>Want to see how it all comes together?</h3>
            <p>
              Explore the development journey, feature milestones, and progress
              behind TimeWise.
            </p>
          </div>

          <Link to="/dev-journal" className="development-history-button">
            Explore Dev Journal
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default DevelopmentHistory
