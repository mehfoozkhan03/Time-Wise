import { getToday } from "./dateUtils";

// Upcoming Events
export const getUpcomingEvents = (

    events,

    limit = 5

) => {

    const today = getToday();

    return [...events]

        .filter(

            (event) =>

                new Date(event.date) >= today

        )

        .sort((a, b) => {

            const dateDifference =

                new Date(a.date) -

                new Date(b.date);

            if (dateDifference !== 0) {

                return dateDifference;

            }

            if (!a.startTime) return 1;

            if (!b.startTime) return -1;

            return a.startTime.localeCompare(

                b.startTime

            );

        })

        .slice(0, limit);

};

// Today's Summary
export const getTodaySummary = (

    events,

    eventConfig

) => {

    const today = getToday()

        .toISOString()

        .split("T")[0];

    const todayEvents = events.filter(

        (event) =>

            event.date === today

    );

    return Object.entries(eventConfig)

        .map(([type, config]) => {

            const count = todayEvents.filter(

                (event) =>

                    event.type === type

            ).length;

            return {

                type,

                config,

                count,

            };

        })

        .filter(

            (item) => item.count > 0

        );

};