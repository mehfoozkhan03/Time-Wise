import { teamData } from "../data/teamData";
import TeamCard from "./TeamCard";

function Team() {

    return (

        <section className="meet_the_team">

            <div className="header_mtm">

                <h1>
                    Meet the Team
                </h1>
                <p>The people behind TimeWise, dedicated to building productivity tools that put humans first.</p>
            </div>

            <div className="mtm_cards">

                {
                    teamData.map(member => (

                        <TeamCard
                            key={member.id}
                            member={member}
                        />

                    ))
                }

            </div>

        </section>
    );
}

export default Team;