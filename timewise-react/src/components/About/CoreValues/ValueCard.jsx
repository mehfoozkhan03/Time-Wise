function ValueCard({value}) {

    return (

        <div className="cards">

            <div className={value.className}>
                {value.icon}
            </div>

            <h3>
                {value.title}
            </h3>

            <p>
                {value.description}
            </p>

        </div>
    );
}

export default ValueCard;