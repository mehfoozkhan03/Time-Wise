function TestimonialSkeleton() {

    return (

        <div className="testimonialSkeleton">

            <div className="sk_line testimonial_title"></div>

            <div className="sk_line testimonial_subtitle"></div>

            <div className="testimonialGrid">

                {[1,2,3].map(item => (

                    <div
                        className="testimonialCard"
                        key={item}
                    >

                        <div className="starRow">

                            {[1,2,3,4,5].map(star => (

                                <div
                                    key={star}
                                    className="sk_star"
                                />

                            ))}

                        </div>

                        <div className="sk_line review_text"></div>

                        <div className="sk_line review_text"></div>

                        <div className="sk_line review_text short"></div>

                        <div className="reviewDivider"></div>

                        <div className="reviewerName"></div>

                        <div className="reviewerRole"></div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default TestimonialSkeleton;