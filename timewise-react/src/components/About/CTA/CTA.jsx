import { FaAward } from "react-icons/fa";

function CTA() {
    return (
        <section className="transform">

            <FaAward className="cta_icon" />

            <h2>
                Ready To Transform Your Team's Productivity
            </h2>

            <p>
                Join thousands of teams using TimeWise to work
                smarter, not harder. Track time thoughtfully and
                maintain the balance you deserve.
            </p>

            <button className="start_today_btn">
                Get Started Today
            </button>

        </section>
    );
}

export default CTA;