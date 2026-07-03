import { valuesData }
from "../data/valuesData";

import ValueCard
from "./ValueCard";

function CoreValues() {

    return (

        <section className="core_values">

            <h1>
                Our Core Values
            </h1>
        <p class="meet">The principle that guide everything we build and every
          decision we make.</p>

            <div className="core_values_wrapper">

                {
                    valuesData.map(value => (

                        <ValueCard
                            key={value.id}
                            value={value}
                        />

                    ))
                }

            </div>

        </section>
    );
}

export default CoreValues;