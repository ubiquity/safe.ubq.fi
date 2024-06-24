import { OAuthToken } from "../types/auth";

export function getLocalStore(key: string): OAuthToken | null {
    const cachedIssues = localStorage.getItem(key);
    if (cachedIssues) {
        try {
            const value = JSON.parse(cachedIssues);

            return value; // as OAuthToken;
        } catch (error) {
            console.error("Error parsing cached issues", error);
        }
    }
    return null;
}

export function setLocalStore(key: string, value: OAuthToken) {
    // remove state from issues before saving to local storage
    localStorage[key] = JSON.stringify(value);
}
