import "./InfoRow.css";

export default function InfoRow({

    icon: Icon,

    label,

    value,

}) {

    return (

        <div className="infoRow">

            <div className="infoIcon">

                <Icon />

            </div>

            <div className="infoContent">

                <span className="infoLabel">

                    {label}

                </span>

                <p className="infoValue">

                    {value || "--"}

                </p>

            </div>

        </div>

    );

}