import './PostCard.css'

import { HiOutlineHeart } from 'react-icons/hi2'
import { HiHeart } from 'react-icons/hi2'
import { HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2'
import { HiOutlineEllipsisHorizontal } from 'react-icons/hi2'

const PostCard = ({ post }) => {
  return (
    <article className="post_card">
      {/* Header */}

      <div className="post_header">
        <div className="post_user">
          <div className="post_avatar">
            {post.author.firstName[0]}
            {post.author.lastName[0]}
          </div>

          <div>
            <h3>
              {post.author.firstName} {post.author.lastName}
            </h3>

            <span>{post.author.designation}</span>

            <p>{post.createdAt}</p>
          </div>
        </div>

        <button className="post_menu_btn">
          <HiOutlineEllipsisHorizontal />
        </button>
      </div>

      {/* Content */}

      <div className="post_content">
        <p>{post.content}</p>

        {post.image && (
          <img src={post.image} alt="Post" className="post_image" />
        )}
      </div>

      {/* Stats */}

      <div className="post_stats">
        <span>
          <HiHeart />
          {post.likesCount} Likes
        </span>

        <span>
          <HiOutlineChatBubbleOvalLeft />
          {post.commentsCount} Comments
        </span>
      </div>

      {/* Actions */}

      <div className="post_actions">
        <button className={post.isLiked ? 'liked' : ''}>
          {post.isLiked ? <HiHeart /> : <HiOutlineHeart />}
          Like
        </button>

        <button>
          <HiOutlineChatBubbleOvalLeft />
          Comment
        </button>
      </div>
    </article>
  )
}

export default PostCard
