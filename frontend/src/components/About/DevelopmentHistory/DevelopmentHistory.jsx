import { Link } from 'react-router-dom'
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
