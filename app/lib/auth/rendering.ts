import { getSupabase } from "../../app/lib/supabase/leagacy_session";
import { GitHubUser } from "../types/github";

export async function renderGitHubLoginButton() {
    const existingButton = document.getElementById("auth-btn");
    if (existingButton) {
        return existingButton;
    }
    const btn = document.createElement("button");
    btn.textContent = "Login with GitHub";
    btn.id = "auth-btn";
    btn.onclick = async () => {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
        });
        if (error) {
            console.error("GitHub login error", error);
        }
    };

    document.body.appendChild(btn);
    return btn;
}

export function renderUserInfo(
    user: GitHubUser
) {
    const newInfo = document.createElement("div");
    newInfo.id = "info-container"
    newInfo.innerHTML = `
    <div id="user-info-container">
        <img id="gh-pp" src="${user.avatar_url}" alt="User avatar" style="width: 320px; height: 320px; margin-top: 20px;" />
        <h2>Hello, ${user.login}.</h2>
    </div>
    `;

    document.body.appendChild(newInfo);

    const userInfoContainer = document.getElementById("user-info-container")
    const logoutButton = document.createElement("button");

    if (!logoutButton) {
        throw new Error("no login btn")
    }

    logoutButton.onclick = () => {
        const supabase = getSupabase();
        supabase.auth.signOut().then(() => {
            window.location.reload();
        })
    };
    logoutButton.textContent = "Logout";

    userInfoContainer?.appendChild(logoutButton)

    return newInfo;
}