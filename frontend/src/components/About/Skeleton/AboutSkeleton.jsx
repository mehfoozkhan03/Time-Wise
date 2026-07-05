import "./AboutSkeleton.css";

import HeroSkeleton from "./HeroSkeleton";
import MissionSkeleton from "./MissionSkeleton";
import TeamSkeleton from "./TeamSkeleton";
import TestimonialSkeleton from "./TestimonialSkeleton";
import CoreValueSkeleton from "./CoreValueSkeleton";
import CTASkeleton from "./CTASkeleton";

function AboutSkeleton() {

    return (
        <div id="aboutSkeleton">

            <HeroSkeleton />

            <MissionSkeleton />

            <TeamSkeleton />

            <TestimonialSkeleton />

            <CoreValueSkeleton />

            <CTASkeleton />

        </div>
    );
}

export default AboutSkeleton;