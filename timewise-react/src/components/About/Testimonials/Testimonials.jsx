import { testimonialData }
from "../data/testimonialData";

import TestimonialCard
from "./TestimonialCard";

function Testimonials() {

    return (

        <section className="what_users_say">

            <h1>
                What Our Users Say
            </h1>
            <p>Real feedback from teams using TimeWise every day.</p>

            <div className="user_say_content">

                {
                    testimonialData.map(review => (

                        <TestimonialCard
                            key={review.id}
                            review={review}
                        />

                    ))
                }

            </div>

        </section>
    );
}

export default Testimonials;