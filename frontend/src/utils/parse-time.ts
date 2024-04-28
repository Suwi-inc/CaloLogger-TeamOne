/**
 * Converts a timestamp to a short time format.
 * @param timeStamp - The timestamp to convert.
 * @returns The short time format string.
 */
export const getTimeShort = (timeStamp: string): string => {
    const date = new Date(timeStamp);
    if (isNaN(date.getTime())) {
        return "";
    }
    return new Intl.DateTimeFormat("en-US", {
        timeStyle: "short",
        hourCycle: "h12",
    }).format(date);
};

/**
 * Converts a timestamp string into a medium date format.
 * @param timeStamp - The timestamp string to be converted.
 * @returns The formatted date string in medium format (e.g., "Jan 1, 2022").
 */
export const getDateMedium = (timeStamp: string): string => {
    const date = new Date(timeStamp);
    if (isNaN(date.getTime())) {
        return "";
    }
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
        date
    );
};

/**
 * Converts the given date and time strings to an ISO string representation.
 *
 * @param date - The date string in the format "YYYY-MM-DD".
 * @param time - The time string in the format "HH:MM".
 * @returns The ISO string representation of the combined date and time.
 */
export const getTimeISO = (date: string, time: string): string => {
    return new Date(`${date}T${time}Z`).toISOString();
};
