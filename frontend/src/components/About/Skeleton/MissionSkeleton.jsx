function MissionSkeleton() {

    return (

        <div className="missionSkeleton">

            <div className="sk_line mission_title"></div>

            <div className="sk_line mission_subtitle"></div>

            <div className="missionCards">

                <div className="missionSkeletonCard">

                    <div className="sk_icon"></div>

                    <div className="sk_line card_title"></div>

                    <div className="sk_line card_text"></div>
                    <div className="sk_line card_text"></div>
                    <div className="sk_line card_text"></div>
                    <div className="sk_line card_text short"></div>

                </div>

                <div className="missionSkeletonCard">

                    <div className="sk_icon"></div>

                    <div className="sk_line card_title"></div>

                    <div className="sk_line card_text"></div>
                    <div className="sk_line card_text"></div>
                    <div className="sk_line card_text"></div>
                    <div className="sk_line card_text short"></div>

                </div>

            </div>

        </div>
    );
}

export default MissionSkeleton;