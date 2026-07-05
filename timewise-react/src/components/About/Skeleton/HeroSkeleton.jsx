function HeroSkeleton() {

    return (

        <div className="heroSkeleton">

            <div className="sk_line hero_title"></div>

            <div className="sk_line hero_title second"></div>

            <div className="sk_line hero_text"></div>

            <div className="sk_line hero_text"></div>

            <div className="sk_line hero_text short"></div>

            <div className="clockSkeleton">

                <div className="clockCircle"></div>

                <span className="dotSkeleton dotLeft"></span>

                <span className="dotSkeleton dotRight"></span>

            </div>

        </div>
    );
}

export default HeroSkeleton;