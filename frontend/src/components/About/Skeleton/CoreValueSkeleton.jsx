function CoreValueSkeleton() {

    return (

        <div className="coreSkeleton">

            <div className="sk_line core_title"></div>

            <div className="sk_line core_subtitle"></div>

            <div className="coreGrid">

                {[1,2,3,4].map(item => (

                    <div
                        className="coreSkeletonCard"
                        key={item}
                    >

                        <div className="sk_value_icon"></div>

                        <div className="sk_line value_title"></div>

                        <div className="sk_line value_text"></div>

                        <div className="sk_line value_text"></div>

                        <div className="sk_line value_text short"></div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default CoreValueSkeleton;