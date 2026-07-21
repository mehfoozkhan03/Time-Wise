import "./CalendarSkeleton.css";

export default function CalendarSkeleton() {
    return (
        <div className="calendarSkeleton">

            <div className="skeletonHeader"></div>

            <div className="skeletonSearch"></div>

            <div className="skeletonFilters">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="skeletonFilter"
                    />
                ))}
            </div>

            <div className="skeletonGrid">
                {[...Array(35)].map((_, i) => (
                    <div
                        key={i}
                        className="skeletonDay"
                    />
                ))}
            </div>

        </div>
    );
}