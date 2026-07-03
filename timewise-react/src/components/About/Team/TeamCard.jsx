function TeamCard({member}) {

    return (

        <div className="content">

            <div className="mtm_pfp">

                <p>
                    {member.initials}
                </p>

            </div>

            <h3>
                {member.name}
            </h3>

            <span>
                {member.role}
            </span>

            <p>
                {member.quote}
            </p>

        </div>
    );
}

export default TeamCard;