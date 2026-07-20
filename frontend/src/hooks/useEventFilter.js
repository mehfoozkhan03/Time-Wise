import { useMemo, useState, useCallback } from "react";
import { EVENT_CONFIG } from "../data/eventConfig";

export default function useEventFilter(events) {
    const initialFilters = useMemo(
        () =>
            Object.keys(EVENT_CONFIG).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {}),
        []
    );

    const [filters, setFilters] = useState(initialFilters);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleFilter = useCallback((type) => {
        setFilters((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    }, []);

    const selectAll = useCallback(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const clearAll = useCallback(() => {
        setFilters(
            Object.keys(EVENT_CONFIG).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {})
        );
    }, []);

    const filteredEvents = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return events.filter((event) => {
            if (!filters[event.type]) return false;

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