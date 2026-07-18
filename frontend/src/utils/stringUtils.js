// Employee Initials
export const getInitials = (name) => {

    if (!name) return "--";

    return name

        .trim()

        .split(" ")

        .map((part) => part[0])

        .join("")

        .slice(0, 2)

        .toUpperCase();

};

// Capitalize First Letter
export const capitalize = (text) => {

    if (!text) return "";

    return text.charAt(0).toUpperCase() +

        text.slice(1);

};

// Truncate Long Text
export const truncate = (

    text,

    maxLength = 30

) => {

    if (!text) return "";

    if (text.length <= maxLength)

        return text;

    return text.slice(0, maxLength) + "...";

};

// Generate Avatar Color
export const getAvatarColor = (text) => {

    const colors = [

        "#3B82F6",

        "#8B5CF6",

        "#06B6D4",

        "#10B981",

        "#F59E0B",

        "#EF4444",

        "#EC4899",

        "#14B8A6",

    ];

    if (!text) return colors[0];

    let hash = 0;

    for (

        let i = 0;

        i < text.length;

        i++

    ) {

        hash += text.charCodeAt(i);

    }

    return colors[

        hash % colors.length

    ];

};