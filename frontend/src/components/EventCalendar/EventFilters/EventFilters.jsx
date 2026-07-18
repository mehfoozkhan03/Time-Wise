import "./EventFilters.css";

import { EVENT_CONFIG } from "../data/eventConfig";
import { FaSearch } from "react-icons/fa";

export default function EventFilters({
    filters,
    setFilters,
    searchTerm,
    setSearchTerm
}) {

    function toggleFilter(type){

        setFilters((prev)=>({

            ...prev,

            [type]: !prev[type]

        }));

    }

    return(
        
        <div className="eventFilters">

            <div className="searchBox">

                <FaSearch />

                <input

                    type="text"

                    placeholder="Search employee..."

                    value={searchTerm}

                    onChange={(e)=>setSearchTerm(e.target.value)}

                />

            </div>

            <div className="filterList">

                {

                    Object.entries(EVENT_CONFIG).map(([type,config])=>(

                        <label

                            key={type}

                            className={`filterItem ${filters[type] ? "active" : ""}`}

                        >

                            <input

                                type="checkbox"

                                checked={filters[type]}

                                onChange={()=>toggleFilter(type)}

                            />

                            <span

                                className="filterColor"

                                style={{

                                    backgroundColor:config.color

                                }}

                            />

                            {config.icon}

                            {config.label}

                        </label>

                    ))

                }

            </div>
        </div>
    );

}