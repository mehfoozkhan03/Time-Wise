// Format: 24 Jul 2026
export const formatDate = (date) => {

    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-IN", {

        day: "numeric",

        month: "short",

        year: "numeric",

    });

};

// Format: Friday, 24 July 2026
export const formatFullDate = (date) => {

    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-IN", {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric",

    });

};

// Format: 09:00 AM
export const formatTime = (time) => {

    if (!time) return "--";

    const [hour, minute] = time.split(":");

    return new Date(0, 0, 0, hour, minute).toLocaleTimeString("en-IN", {

        hour: "numeric",

        minute: "2-digit",

        hour12: true,

    });

};

// Check Today
export const isToday = (date) => {

    const today = new Date();

    const current = new Date(date);

    return (

        today.getDate() === current.getDate() &&

        today.getMonth() === current.getMonth() &&

        today.getFullYear() === current.getFullYear()

    );

};

// Check Weekend
export const isWeekend = (date) => {

    const day = new Date(date).getDay();

    return day === 0 || day === 6;

};