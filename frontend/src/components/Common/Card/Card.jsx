import "./Card.css";

export default function Card({

    title,

    icon,

    children,

    className = "",

}) {

    return (

        <section className={`card ${className}`}>

            {

                (title || icon) && (

                    <div className="cardHeader">

                        {

                            icon && (

                                <span className="cardIcon">

                                    {icon}

                                </span>

                            )

                        }

                        {

                            title && (

                                <h3>

                                    {title}

                                </h3>

                            )

                        }

                    </div>

                )

            }

            <div className="cardBody">

                {children}

            </div>

        </section>

    );

}