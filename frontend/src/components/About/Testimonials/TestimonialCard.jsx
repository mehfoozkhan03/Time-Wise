function TestimonialCard({review}) {

    return (

        <div className="review">

            <div className="stars">

                ★★★★★

            </div>

            <p>
                {review.review}
            </p>

            <hr/>

            <h3>
                {review.name}
            </h3>

            <span>
                {review.role}
            </span>

        </div>
    );
}

export default TestimonialCard;