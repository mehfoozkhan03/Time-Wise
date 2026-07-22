import './ThoughtCard.css'

import Card from '../../Card/Card'

import {
  FaHeart,
  FaRegCommentDots,
  FaBookmark,
  FaStar,
  FaEllipsisH,
} from 'react-icons/fa'

export default function ThoughtCard() {
  return (
    <Card className="thought_card" id="tour-thought-card">
      <div className="thought_header">
        <div className="thought_user">
          <div className="thought_avatar">AK</div>

          <div>
            <h3>Arnav Kharade</h3>

            <span>Frontend Developer • 2 hours ago</span>
          </div>
        </div>

        <button className="thought_menu">
          <FaEllipsisH />
        </button>
      </div>

      <div className="featured_badge">
        <FaStar />
        Featured Thought
      </div>

      <p className="thought_text">
        Success isn't about working longer hours. It's about making every hour
        count. Small improvements every day compound into extraordinary
        achievements.
      </p>

      <div className="thought_actions" id="tour-thought-actions">
        <button>
          <FaHeart />
          28
        </button>

        <button>
          <FaRegCommentDots />8
        </button>

        <button>
          <FaBookmark />
          Save
        </button>
      </div>
    </Card>
  );
}
