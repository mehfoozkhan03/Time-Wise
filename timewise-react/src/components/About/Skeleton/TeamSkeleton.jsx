function TeamSkeleton() {

    return (

        <div className="teamSkeleton">

            <div className="sk_line team_title"></div>

            <div className="sk_line team_subtitle"></div>

            <div className="teamGrid">

                {[1,2,3,4].map(item => (

                    <div
                        className="teamSkeletonCard"
                        key={item}
                    >

                        <div className="sk_avatar"></div>

                        <div className="sk_line team_name"></div>

                        <div className="sk_line team_role"></div>

                        <div className="sk_line team_text"></div>

                        <div className="sk_line team_text"></div>

                        <div className="sk_line team_text short"></div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default TeamSkeleton;