import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Card from '../../Card/Card';
import './FeaturedThought.css';

import {
  FaHeart,
  FaComment,
  FaBookmark,
  FaArrowRight,
  FaStar,
} from 'react-icons/fa';

export default function FeaturedThought() {
  const navigate = useNavigate();

  const { featured, loading } = useSelector((state) => state.post);

  if (loading) {
    return (
      <section className="featured_thought_section">
        <h2>Featured Thought</h2>

        <Card className="featured_thought_card">
          <p>Loading featured thought...</p>
        </Card>
      </section>
    );
  }

  if (!featured) {
    return (
      <section className="featured_thought_section">
        <h2>Featured Thought</h2>

        <Card className="featured_thought_card">
          <p>No featured thought available.</p>
        </Card>
      </section>
    );
  }

  const author = featured.createdBy;

  const initials = `${author.firstName?.[0] ?? ''}${author.lastName?.[0] ?? ''}`;

  return (
    <section className="featured_thought_section" id="tour-thought-card">
      <h2>Featured Thought</h2>

      <Card className="featured_thought_card">
        <div className="featured_badge">
          <FaStar />

          <span>Thought of the Day</span>
        </div>

        <div className="thought_author">
          <div className="author_avatar">{initials}</div>

          <div className="author_info">
            <h3>
              {author?.firstName} {author?.lastName}
            </h3>

            <span>{author?.designation || 'Employee'}</span>
          </div>
        </div>

        <blockquote>"{featured?.content}"</blockquote>

        <div className="thought_actions" id="tour-thought-actions">
          <div className="action_item">
            <FaHeart />

            <span>{featured.likes?.length}</span>
          </div>

          <div className="action_item">
            <FaComment />

            <span>{featured.comments?.length}</span>
          </div>

          <div className="action_item">
            <FaBookmark />
          </div>
        </div>

        <button
          className="community_button"
          onClick={() => navigate('/community')}
        >
          <span>View Community</span>

          <FaArrowRight />
        </button>
      </Card>
    </section>
  );
}
