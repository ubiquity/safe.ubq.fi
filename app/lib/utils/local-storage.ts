import { OauthToken } from "../types/auth";

export function getLocalStore(key: string): OauthToken | null {
  const cachedIssues = localStorage.getItem(key);
  if (cachedIssues) {
    try {
      return JSON.parse(cachedIssues); // as OauthToken;
    } catch (error) {
      console.error("Error parsing cached issues", error);
    }
  }
  return null;
}

export function setLocalStore(key: string, value: OauthToken) {
  // remove state from issues before saving to local storage
  localStorage[key] = JSON.stringify(value);
}
