import './FeaturedThought.css'
import { useNavigate } from 'react-router-dom'

import Card from '../../Card/Card'

import {
  FaHeart,
  FaComment,
  FaBookmark,
  FaArrowRight,
  FaStar,
} from 'react-icons/fa'

export default function FeaturedThought() {
  const navigate = useNavigate()

  const thought = {
    author: 'Arnav Kharade',
    designation: 'Frontend Developer',
    initials: 'AK',

    content:
      "The strongest teams aren't built on talent alone. They are built on trust, communication, and the willingness to help each other improve every single day.",

    likes: 28,
    comments: 7,
    bookmarked: true,

    createdAt: '2 hours ago',
  }

  return (
    <section className="featured_thought_section" id="tour-thought-card">
      <h2>Featured Thought</h2>

      <Card className="featured_thought_card">
        <div className="featured_badge">
          <FaStar />
          <span>Thought of the Day</span>
        </div>

        <div className="thought_author">
          <div className="author_avatar">{thought.initials}</div>

          <div className="author_info">
            <h3>{thought.author}</h3>

            <span>
              {thought.designation} • {thought.createdAt}
            </span>
          </div>
        </div>

        <blockquote>"{thought.content}"</blockquote>

        <div className="thought_actions" id="tour-thought-actions">
          <div className="action_item">
            <FaHeart />
            <span>{thought.likes}</span>
          </div>

          <div className="action_item">
            <FaComment />
            <span>{thought.comments}</span>
          </div>

          <div className="action_item">
            <FaBookmark className={thought.bookmarked ? "bookmarked" : ""} />
          </div>
        </div>

        <button
          className="community_button"
          onClick={() => navigate("/community")}
        >
          <span>View Community</span>

          <FaArrowRight />
        </button>
      </Card>
    </section>
  );
}
