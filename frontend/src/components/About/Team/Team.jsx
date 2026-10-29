
import { useEffect, useState } from "react";
import { teamData } from "../data/teamData";
import TeamCard from "./TeamCard";
import Skeleton from "../../../components/Skeleton/Skeleton";

function Team() {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="meet_the_team">
      <div className="header_mtm">
        {showSkeleton ? (
          <>
            <div className="team_heading_skeleton">
              <Skeleton width="220px" height="30px" />
            </div>

            <div className="team_subtitle_skeleton">
              <Skeleton width="550px" height="15px" />
            </div>
          </>
        ) : (
          <>
            <h1>Meet the Team</h1>
            <p>
              The people behind TimeWise, dedicated to building
              productivity tools that put humans first.
            </p>
          </>
        )}
      </div>

      <div className="mtm_cards">
        {showSkeleton
          ? teamData.map((member) => (
              <div className="team_skeleton_card" key={member.id}>
                {/* Avatar */}
                <Skeleton
                  width="60px"
                  height="60px"
                  radius="50%"
                />

                {/* Name */}
                <div className="team_name_skeleton">
                  <Skeleton width="130px" height="17px" />
                </div>

                {/* Designation */}
                <div className="team_role_skeleton">
                  <Skeleton width="120px" height="14px" />
                </div>

                {/* Description */}
                <div className="team_description_skeleton">
                  <Skeleton width="100%" height="14px" />

                  <div className="team_description_line">
                    <Skeleton width="90%" height="14px" />
                  </div>

                  <div className="team_description_line">
                    <Skeleton width="65%" height="14px" />
                  </div>
                </div>
              </div>
            ))
          : teamData.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
      </div>
    </section>
  );
}

export default Team;
