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
    const keywords = searchTerm
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    return events.filter((event) => {
        if (!filters[event.type]) return false;

        if (keywords.length === 0) return true;

        const searchableText = [
            event.employee,
            event.department,
            event.title,
            event.description,
            EVENT_CONFIG[event.type]?.label,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return keywords.every((keyword) =>
            searchableText.includes(keyword)
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