import { useMemo, useState } from "react";
import { EVENT_CONFIG } from "../data/eventConfig";

export default function useEventFilter(events) {

    // Initial filter state
    const initialFilters = Object.keys(EVENT_CONFIG).reduce((acc, key) => {

        acc[key] = true;

        return acc;

    }, {});

    const [filters, setFilters] = useState(initialFilters);

    const [searchTerm, setSearchTerm] = useState("");

    // Toggle a single filter
    const toggleFilter = (type) => {

        setFilters((prev) => ({

            ...prev,

            [type]: !prev[type],

        }));

    };

    // Enable all filters
    const selectAll = () => {

        setFilters(initialFilters);

    };

    // Disable all filters
    const clearAll = () => {

        const clearedFilters = Object.keys(EVENT_CONFIG).reduce((acc, key) => {

            acc[key] = false;

            return acc;

        }, {});

        setFilters(clearedFilters);

    };

    // Filter events
    const filteredEvents = useMemo(() => {

        const search = searchTerm.trim().toLowerCase();

        return events.filter((event) => {

            const matchesType = filters[event.type];

            if (!matchesType) return false;

            if (!search) return true;

            return (

                event.employee?.toLowerCase().includes(search) ||

                event.department?.toLowerCase().includes(search) ||

                event.title?.toLowerCase().includes(search) ||

                event.description?.toLowerCase().includes(search)

            );

        });

    }, [events, filters, searchTerm]);

    return {

        filters,

        searchTerm,

        setSearchTerm,

        toggleFilter,

        selectAll,

        clearAll,

        filteredEvents,

    };

}