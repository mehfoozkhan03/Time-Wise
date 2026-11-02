
function TestimonialCard({ review }) {
  const initials = review.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="review">
      {/* Card Header */}
      <div className="review_header">
        <div className="stars" aria-label="5 out of 5 stars">
          ★★★★★
        </div>

        <span className="review_quote" aria-hidden="true">
          ”
        </span>
      </div>

      {/* Review Content */}
      <p className="review_text">
        {review.review}
      </p>

      <hr />

      {/* Reviewer Information */}
      <div className="review_user">
        <div className="review_avatar">
          {initials}
        </div>

        <div className="review_user_info">
          <h3>{review.name}</h3>
          <span>{review.role}</span>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
