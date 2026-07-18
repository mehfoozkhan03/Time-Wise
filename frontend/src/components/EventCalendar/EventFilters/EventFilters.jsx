import "./EventFilters.css";

import { FaSearch } from "react-icons/fa";

import { EVENT_CONFIG } from "../../../data/eventConfig";

export default function EventFilters({

    filters,

    toggleFilter,

    searchTerm,

    setSearchTerm,

    selectAll,

    clearAll,

    events

}) {

    return (

        <div className="eventFilters">

            <div className="searchBar">

                <FaSearch/>

                <input

                    type="text"

                    placeholder="Search employee or event..."

                    value={searchTerm}

                    onChange={(e)=>setSearchTerm(e.target.value)}

                />

            </div>

            <div className="filterActions">

                <button

                    onClick={selectAll}

                >

                    Select All

                </button>

                <button

                    onClick={clearAll}

                >

                    Clear All

                </button>

            </div>

            <div className="filterList">

                {

                    Object.entries(EVENT_CONFIG).map(([type,config])=>{

                        const count = events.filter(

                            event=>event.type===type

                        ).length;

                        return(

                            <button

                                key={type}

                                onClick={()=>toggleFilter(type)}

                                className={`filterChip ${filters[type] ? "active" : ""}`}

                            >

                                <span className="chipIcon">

                                    {config.icon}

                                </span>

                                <span>

                                    {config.label}

                                </span>

                                <span className="count">

                                    {count}

                                </span>

                            </button>

                        );

                    })

                }

            </div>

        </div>

    );

}