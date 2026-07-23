import './RecentActivity.css'

export default function RecentActivity() {
  const activities = [
    {
      title: 'Checked In',
      time: '09:04 AM',
    },
    {
      title: 'Break Started',
      time: '01:01 PM',
    },
    {
      title: 'Break Ended',
      time: '01:29 PM',
    },
    {
      title: 'Checked Out',
      time: '06:08 PM',
    },
  ]

  return (
    <section className="recent_activity">
      <div className="section_header">
        <h2>Recent Activity</h2>
      </div>

      <div className="activity_list">
        {activities.map((activity, index) => (
          <div className="activity_item" key={index}>
            <div className="activity_dot" />

            <div className="activity_content">
              <h4>{activity.title}</h4>

              <span>{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
