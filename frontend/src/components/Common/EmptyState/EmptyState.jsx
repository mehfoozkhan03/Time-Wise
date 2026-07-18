import "./EmptyState.css";

export default function EmptyState({

    icon,

    title = "No Data",

    description = "Nothing to display.",

}) {

    return (

        <div className="emptyState">

            <div className="emptyIcon">

                {icon}

            </div>

            <h3>

                {title}

            </h3>

            <p>

                {description}

            </p>

        </div>

    );

}