import {
    getTimeShort,
    getDateMedium,
    getTimeISO,
} from "../../utils/parse-time";

describe("getTimeShort Function", () => {
    test("returns short time format", () => {
        const timeStamp = "2024-04-27T12:30:00";
        const expected = "12:30 PM";
        const result = getTimeShort(timeStamp);
        expect(result).toBe(expected);
    });

    test("returns empty string if invalid timestamp", () => {
        const timeStamp = "invalid-timestamp";
        const result = getTimeShort(timeStamp);
        expect(result).toBe("");
    });
});

describe("getDateMedium Function", () => {
    test("returns medium date format", () => {
        const timeStamp = "2024-04-27T12:30:00";
        const expected = "Apr 27, 2024";
        const result = getDateMedium(timeStamp);
        expect(result).toBe(expected);
    });

    test("returns empty string if invalid timestamp", () => {
        const timeStamp = "invalid-timestamp";
        const result = getDateMedium(timeStamp);
        expect(result).toBe("");
    });
});

describe("getTimeISO Function", () => {
    test("returns ISO formatted time", () => {
        const date = "2024-04-27";
        const time = "12:30:00";
        const expected = "2024-04-27T12:30:00.000Z";
        const result = getTimeISO(date, time);
        expect(result).toBe(expected);
    });
});
