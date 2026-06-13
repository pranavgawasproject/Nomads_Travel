export const SELECTED_DESTINATION_SESSION_KEY = "roamiqSelectedDestination";

const normalizeValue = (value) =>
    typeof value === "string" ? value.trim().toLowerCase() : "";

const normalizeDisplayValue = (value) =>
    typeof value === "string" ? value.trim() : "";

export const persistSelectedDestination = ({ continent, country, city, title }) => {
    if (typeof window === "undefined") return;

    const normalizedCountry = normalizeValue(country);
    const normalizedCity = normalizeValue(city);
    const normalizedTitle = normalizeDisplayValue(title);

    if (!normalizedCountry || !normalizedCity) return;

    window.sessionStorage.setItem(
        SELECTED_DESTINATION_SESSION_KEY,
        JSON.stringify({
            continent: normalizeValue(continent),
            country: normalizedCountry,
            city: normalizedCity,
            title: normalizedTitle,
            updatedAt: Date.now(),
        }),
    );
};

export const readSelectedDestination = () => {
    if (typeof window === "undefined") return null;

    const selectedDestination = window.sessionStorage.getItem(
        SELECTED_DESTINATION_SESSION_KEY,
    );

    if (!selectedDestination) return null;

    try {
        const parsed = JSON.parse(selectedDestination);
        if (!parsed || typeof parsed !== "object") return null;

        const country = normalizeValue(parsed.country);
        const city = normalizeValue(parsed.city);

        if (!country || !city) return null;

        return {
            continent: normalizeValue(parsed.continent),
            country,
            city,
            title: normalizeDisplayValue(parsed.title),
            updatedAt:
                typeof parsed.updatedAt === "number" ? parsed.updatedAt : undefined,
        };
    } catch (error) {
        console.error("Failed to read selected destination from session storage", error);
        return null;
    }
};

export const getCountryNameFromSelectedDestination = (countries = []) => {
    const selectedDestination = readSelectedDestination();
    if (!selectedDestination?.country) return "";

    const matchedCountry = countries.find(
        (country) => normalizeValue(country?.name) === selectedDestination.country,
    );

    return matchedCountry?.name || "";
};
