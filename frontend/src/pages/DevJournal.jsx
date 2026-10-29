import { Link } from 'react-router-dom'
import '../styles/DevJournal.css'

const milestones = [
  {
    id: 'foundation',
    number: '01',
    category: 'Core Development',
    title: 'Establishing the Foundation',
    status: 'Project foundation',
    description:
      'The foundation of TimeWise: building an employee management experience with a clear structure and room for future features.',
    details: [
      "Establishing the application's structure.",
      'Building the foundation for the TimeWise experience.',
    ],
    tags: ['TimeWise', 'Development'],
  },
  {
    id: 'attendance',
    number: '02',
    category: 'Employee Management',
    title: 'Attendance Management',
    status: 'Working',
    description:
      'Developing attendance workflows to support the employee workday, from checking in to checking out.',
    details: [
      'Employee check-in and check-out workflows.',
      'Break tracking and working-time calculations.',
      'Attendance status and daily attendance information.',
    ],
    tags: ['Attendance', 'Employee'],
  },
  {
    id: 'working-hours',
    number: '03',
    category: 'Scheduling',
    title: 'Working Hours',
    status: 'Working',
    description:
      'Adding working-hours information to support the scheduling and attendance experience.',
    details: [
      'Working-hours information.',
      'Integration with the wider employee experience.',
    ],
    tags: ['Working Hours', 'Scheduling'],
  },
  {
    id: 'holidays',
    number: '04',
    category: 'Scheduling',
    title: 'Holiday Handling',
    status: 'Working',
    description:
      'Incorporating holiday information and handling into the TimeWise experience.',
    details: [
      'Holiday display and handling.',
      'Connecting holiday information with the employee-facing experience.',
    ],
    tags: ['Holidays', 'Calendar'],
  },
  {
    id: 'community',
    number: '05',
    category: 'Community',
    title: 'Community Experience',
    status: 'Completed',
    description:
      'Building a dedicated Community experience with posts, profiles, and navigation that can be shared through URLs.',
    details: [
      'Community page and post navigation.',
      'Individual post and community profile pages.',
      'URL parameter handling and shareable navigation.',
    ],
    tags: ['Community', 'Navigation', 'Sharing'],
  },
]

function DevJournal() {
  return (
    <main className="dev-journal-page">
      <section className="dev-journal-hero">
        <div className="dev-journal-container">
          <Link to="/about" className="dev-journal-back-link">
            <span aria-hidden="true">←</span>
            Back to About
          </Link>

          <div className="dev-journal-hero-content">
            <span className="dev-journal-eyebrow">THE MAKING OF TIMEWISE</span>

            <h1>
              The Dev <span>Journal.</span>
            </h1>

            <p>
              Every feature starts as an idea. Follow the work behind TimeWise,
              from its foundations to the features that shape the experience.
            </p>

            <div className="dev-journal-hero-meta">
              <span className="dev-journal-meta-dot" aria-hidden="true" />
              <span>Development milestones</span>
              <span className="dev-journal-meta-divider" aria-hidden="true" />
              <span>{milestones.length} entries</span>
            </div>
          </div>

          <div className="dev-journal-overview">
            <div className="dev-journal-overview-card">
              <span className="dev-journal-overview-value">
                {String(milestones.length).padStart(2, '0')}
              </span>
              <span className="dev-journal-overview-label">
                Documented milestones
              </span>
            </div>

            <div className="dev-journal-overview-card">
              <span className="dev-journal-overview-value">05</span>
              <span className="dev-journal-overview-label">Featured areas</span>
            </div>

            <div className="dev-journal-overview-card">
              <span className="dev-journal-overview-value">01</span>
              <span className="dev-journal-overview-label">
                Evolving project
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="dev-journal-timeline-section"
        aria-labelledby="dev-journal-timeline-heading"
      >
        <div className="dev-journal-container">
          <div className="dev-journal-section-heading">
            <div>
              <span className="dev-journal-section-eyebrow">
                PROJECT PROGRESS
              </span>

              <h2 id="dev-journal-timeline-heading">The journey so far</h2>
            </div>

            <p>
              A feature-focused overview of the work completed and the
              functionality currently in place.
            </p>
          </div>

          <div className="dev-journal-timeline">
            {milestones.map((milestone) => (
              <article className="dev-journal-entry" key={milestone.id}>
                <div className="dev-journal-timeline-marker">
                  <span>{milestone.number}</span>
                </div>

                <div className="dev-journal-entry-card">
                  <div className="dev-journal-entry-top">
                    <span className="dev-journal-entry-category">
                      {milestone.category}
                    </span>

                    <span
                      className={`dev-journal-status dev-journal-status-${milestone.status
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                    >
                      <span
                        className="dev-journal-status-dot"
                        aria-hidden="true"
                      />
                      {milestone.status}
                    </span>
                  </div>

                  <h3>{milestone.title}</h3>

                  <p className="dev-journal-entry-description">
                    {milestone.description}
                  </p>

                  <div className="dev-journal-entry-details">
                    <h4>What's included</h4>

                    <ul>
                      {milestone.details.map((detail) => (
                        <li key={detail}>
                          <span aria-hidden="true">✓</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="dev-journal-tags" aria-label="Related topics">
                    {milestone.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="dev-journal-note">
            <span className="dev-journal-note-icon" aria-hidden="true">
              i
            </span>

            <p>
              <strong>About this timeline:</strong> These entries provide a
              feature-level overview, not a complete commit-by-commit history.
              Dates and contributor details will be added when they have been
              verified against the project's development records.
            </p>
          </div>

          <div className="dev-journal-bottom">
            <h2>There’s more to build.</h2>

            <p>
              TimeWise continues to evolve as new ideas become features and
              existing functionality improves.
            </p>

            <Link to="/about" className="dev-journal-bottom-link">
              Discover TimeWise
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default DevJournal
